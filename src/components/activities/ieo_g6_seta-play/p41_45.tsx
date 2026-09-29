"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import {
  Calendar,
  Moon,
  BookOpen,
  HelpCircle,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  DialogueTheatre3D,
  LibraryDesk3D,
  Avatar3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q41 — 📅 3D Family Calendar
   Dialogue:
     Henry: Can I go to the match with the guys?
     Mother: No chance, not a ______ of Sundays.
   Options: A. week, B. year, C. month, D. millennium -> Key: A (week)
   ══════════════════════════════════════════════════════════════════════ */
export function Q41BruisedKneeActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedWord?: string; calendarTurned: boolean }>({
    question,
    initial: { selectedWord: undefined, calendarTurned: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedWord) return { note: "Rotate the family calendar wheel and install the idiomatic unit" };
      const map: Record<string, string> = { week: "A", year: "B", month: "C", millennium: "D" };
      return {
        value: w.selectedWord,
        optionId: map[w.selectedWord],
        note:
          w.selectedWord === "week"
            ? "Idiom match: 'not in a month of Sundays' / 'not a week of Sundays' expresses an emphatic refusal or impossibility."
            : `Selected: ${w.selectedWord}`,
      };
    },
  });

  const words = ["week", "year", "month", "millennium"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q41 · 📅 3D Family Calendar"
      subtitle="Complete Mother's emphatic refusal idiom by selecting 'week'"
      hints={[
        "The traditional English idiom expressing emphatic refusal is 'not a week of Sundays'.",
      ]}
    >
      <Board>
        {/* 3D Living Room Calendar */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-300/80 bg-gradient-to-b from-amber-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-amber-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <Calendar className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Family Sunday Calendar
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Dialogue: Henry (Request) vs Mother (Refusal)
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <DialogueTheatre3D position={[0, 0, 0]} />
            <Avatar3D position={[-0.8, 0, 0]} pose="standing" shirtColor="#2563EB" />
            <Avatar3D position={[0.8, 0, 0]} pose="standing" shirtColor="#DC2626" hairStyle="bun" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-amber-50/90 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <div className="text-left max-w-md mx-auto space-y-2 text-slate-900 text-sm sm:text-base font-medium">
            <p><span className="font-bold text-blue-700">Henry:</span> Can I go to the match with the guys?</p>
            <p>
              <span className="font-bold text-red-700">Mother:</span> No chance, not a{" "}
              <SentenceSlot value={play.world.selectedWord} filled={!!play.world.selectedWord} />{" "}
              of Sundays.
            </p>
          </div>
        </div>

        {/* Word Bay */}
        <Bay label="Idiomatic Time Unit Bay" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {words.map((w) => (
              <WordPill
                key={w}
                word={w}
                selected={play.world.selectedWord === w}
                onClick={() => play.patch({ selectedWord: w })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q42 — 🌙 3D Time-Rewind Game
   Dialogue:
     Dimitri: I wish I ______ home earlier last night, I'm so tired today.
   Options: A. was going, B. had been going, C. had gone, D. have gone -> Key: C (had gone)
   ══════════════════════════════════════════════════════════════════════ */
export function Q42CuriousNeighbourActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedAspect?: string; timeRewound: boolean }>({
    question,
    initial: { selectedAspect: undefined, timeRewound: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedAspect) return { note: "Rewind Dimitri's timeline to last night and install the past-perfect regret verb" };
      const map: Record<string, string> = {
        "was going": "A",
        "had been going": "B",
        "had gone": "C",
        "have gone": "D",
      };
      return {
        value: w.selectedAspect,
        optionId: map[w.selectedAspect],
        note:
          w.selectedAspect === "had gone"
            ? "Wish + Past Perfect: 'wish I had gone' expresses regret about a past completed action."
            : `Selected: ${w.selectedAspect}`,
      };
    },
  });

  const aspects = ["was going", "had been going", "had gone", "have gone"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q42 · 🌙 3D Time-Rewind Game"
      subtitle="Rewind the midnight city timeline to express Dimitri's past regret with 'had gone'"
      hints={[
        "Expressing regret about past events ('last night') with 'I wish' requires the Past Perfect ('had gone').",
      ]}
    >
      <Board>
        {/* 3D Night Metropolis */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-indigo-300/80 bg-gradient-to-b from-indigo-950 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-indigo-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-xs">
                <Moon className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider block">
                  Midnight Time-Rewind Console
                </span>
                <span className="text-[11px] font-medium text-indigo-400">
                  Target: Departure Time Last Night (1:30 AM → Desired: 10:00 PM)
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <DialogueTheatre3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#6366F1" expression="worried" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-indigo-950/80 border-2 border-indigo-700 text-indigo-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            <span className="text-indigo-300 font-bold block mb-1">Dimitri:</span>
            I wish I{" "}
            <SentenceSlot value={play.world.selectedAspect} filled={!!play.world.selectedAspect} />{" "}
            home earlier last night, I&apos;m so tired today.
          </p>
        </div>

        {/* Aspect Bay */}
        <Bay label="Past Regret Aspect Bay" tone="indigo">
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
   Q43 — 📖 3D Study Room Time Pressure
   Dialogue:
     Aunty: Can you take this through to the living room?
     Nephew: Can I do it in a second? I ______ finish this page first.
   Options: A. could, B. will to, C. may be, D. must -> Key: D (must)
   ══════════════════════════════════════════════════════════════════════ */
export function Q43DinnerResponseActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedModal?: string; pageFinishing: boolean }>({
    question,
    initial: { selectedModal: undefined, pageFinishing: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedModal) return { note: "Inspect Nephew's urgent reading obligation and select the modal 'must'" };
      const map: Record<string, string> = { could: "A", "will to": "B", "may be": "C", must: "D" };
      return {
        value: w.selectedModal,
        optionId: map[w.selectedModal],
        note:
          w.selectedModal === "must"
            ? "Modal obligation: 'must finish this page first' expresses strong immediate necessity."
            : `Selected: ${w.selectedModal}`,
      };
    },
  });

  const modals = ["could", "will to", "may be", "must"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q43 · 📖 3D Study Room Time Pressure"
      subtitle="Establish Nephew's immediate reading necessity and install the modal 'must'"
      hints={[
        "'Must' expresses strong present obligation or urgent necessity before performing the requested chore.",
      ]}
    >
      <Board>
        {/* 3D Study Desk */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-300/80 bg-gradient-to-b from-emerald-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-emerald-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Study Room Chore Interruption
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Aunty: Carry Object to Living Room · Nephew: 3 Lines Left on Page
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <LibraryDesk3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="sitting_studying" shirtColor="#059669" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-emerald-50/90 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <div className="text-left max-w-md mx-auto space-y-2 text-slate-900 text-sm sm:text-base font-medium">
            <p><span className="font-bold text-purple-700">Aunty:</span> Can you take this through to the living room?</p>
            <p>
              <span className="font-bold text-emerald-700">Nephew:</span> Can I do it in a second? I{" "}
              <SentenceSlot value={play.world.selectedModal} filled={!!play.world.selectedModal} />{" "}
              finish this page first.
            </p>
          </div>
        </div>

        {/* Modal Bay */}
        <Bay label="Modal Obligation Bay" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {modals.map((m) => (
              <WordPill
                key={m}
                word={m}
                selected={play.world.selectedModal === m}
                onClick={() => play.patch({ selectedModal: m })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q44 — 🕵️ 3D Mystery Conversation
   Dialogue:
     Amanda: How is this possible?
     June: ______ ask me, I've no idea what you are talking about.
   Options: A. Please, B. Don't, C. Can't, D. Won't -> Key: B (Don't)
   ══════════════════════════════════════════════════════════════════════ */
export function Q44StitchInTimeActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedWord?: string; conversationDone: boolean }>({
    question,
    initial: { selectedWord: undefined, conversationDone: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedWord) return { note: "Inspect June's conversational response and select 'Don't'" };
      const map: Record<string, string> = { Please: "A", "Don't": "B", "Can't": "C", "Won't": "D" };
      return {
        value: w.selectedWord,
        optionId: map[w.selectedWord],
        note:
          w.selectedWord === "Don't"
            ? "Conversational idiom: 'Don't ask me' is the natural phrase used when disclaiming any knowledge."
            : `Selected: ${w.selectedWord}`,
      };
    },
  });

  const words = ["Please", "Don't", "Can't", "Won't"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q44 · 🕵️ 3D Mystery Conversation"
      subtitle="Complete June's conversational response disclaiming knowledge with 'Don't'"
      hints={[
        "The standard colloquial response when someone has no idea is 'Don't ask me!'.",
      ]}
    >
      <Board>
        {/* 3D Mystery Room */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-purple-300/80 bg-gradient-to-b from-purple-950 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-purple-800/60 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                <HelpCircle className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-200 uppercase tracking-wider block">
                  Mystery Lounge Interrogation
                </span>
                <span className="text-[11px] font-medium text-purple-400">
                  Amanda (Confused) vs June (Total Ignorance of Subject)
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <DialogueTheatre3D position={[0, 0, 0]} />
            <Avatar3D position={[-0.8, 0, 0]} pose="standing" expression="surprised" shirtColor="#9333EA" />
            <Avatar3D position={[0.8, 0, 0]} pose="gesturing" shirtColor="#3B82F6" hairStyle="ponytail" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-purple-950/80 border-2 border-purple-700 text-purple-100 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <div className="text-left max-w-md mx-auto space-y-2 text-sm sm:text-base font-medium">
            <p><span className="font-bold text-purple-400">Amanda:</span> How is this possible?</p>
            <p>
              <span className="font-bold text-sky-400">June:</span>{" "}
              <SentenceSlot value={play.world.selectedWord} filled={!!play.world.selectedWord} />{" "}
              ask me, I&apos;ve no idea what you are talking about.
            </p>
          </div>
        </div>

        {/* Word Bay */}
        <Bay label="Conversational Marker Bay" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {words.map((w) => (
              <WordPill
                key={w}
                word={w}
                selected={play.world.selectedWord === w}
                onClick={() => play.patch({ selectedWord: w })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q45 — 🤝 3D Help Request Simulation
   Dialogue:
     Eugene: Don't worry about those guys. If they wanted our help they ______ asked.
   Options: A. would've, B. might, C. may have, D. must -> Key: A (would've)
   ══════════════════════════════════════════════════════════════════════ */
export function Q45NegativeAgreementActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedConditional?: string; commsChecked: boolean }>({
    question,
    initial: { selectedConditional: undefined, commsChecked: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedConditional) return { note: "Reconstruct Eugene's counterfactual statement with 'would've'" };
      const map: Record<string, string> = {
        "would've": "A",
        might: "B",
        "may have": "C",
        must: "D",
      };
      return {
        value: w.selectedConditional,
        optionId: map[w.selectedConditional],
        note:
          w.selectedConditional === "would've"
            ? "Third conditional result clause: 'If they wanted our help they would've [would have] asked.'"
            : `Selected: ${w.selectedConditional}`,
      };
    },
  });

  const conditionals = ["would've", "might", "may have", "must"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q45 · 🤝 3D Help Request Simulation"
      subtitle="Construct the counterfactual result clause with the contracted modal 'would've'"
      hints={[
        "The conditional sentence 'If they wanted... they would've asked' expresses a past hypothetical scenario.",
      ]}
    >
      <Board>
        {/* 3D Social Decision Board */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-sky-300/80 bg-gradient-to-b from-sky-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-sky-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                <Users className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Peer Communication Board
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Communication Status: No request made → No intervention needed
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <DialogueTheatre3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#0284C7" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-sky-50/90 border-2 border-sky-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <div className="text-left max-w-md mx-auto space-y-2 text-slate-900 text-sm sm:text-base font-medium">
            <p className="text-slate-600 text-xs block mb-1 font-bold">Eugene:</p>
            <p>
              Don&apos;t worry about those guys. If they wanted our help they{" "}
              <SentenceSlot value={play.world.selectedConditional} filled={!!play.world.selectedConditional} />{" "}
              asked.
            </p>
          </div>
        </div>

        {/* Conditional Bay */}
        <Bay label="Conditional Result Modal Bay" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {conditionals.map((c) => (
              <WordPill
                key={c}
                word={c}
                selected={play.world.selectedConditional === c}
                onClick={() => play.patch({ selectedConditional: c })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

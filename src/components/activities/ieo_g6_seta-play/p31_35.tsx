"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import { BookOpen, TreePine, ShieldCheck, Truck, MapPin } from "lucide-react";
import {
  BeaverHabitat3D,
  GlacierExpedition3D,
  GoaVilla3D,
  VillaVerandah3D,
  Avatar3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q31 — Beaver Physical Anatomy (Huge front teeth)
   Question: "What is interesting about a beaver's appearance?"
   Options:
     A. They are very small.
     B. They are the biggest animal in South America.
     C. They have huge front teeth.
     D. They have thin tails. -> Key: C (They have huge front teeth.)
   ══════════════════════════════════════════════════════════════════════ */
export function Q31BeaverAnatomyActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ feature?: string }>({
    question,
    initial: { feature: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.feature) return { note: "Select the distinctive anatomical feature mentioned in the passage" };
      const map: Record<string, string> = {
        "They are very small.": "A",
        "They are the biggest animal in South America.": "B",
        "They have huge front teeth.": "C",
        "They have thin tails.": "D",
      };
      return {
        value: w.feature,
        optionId: map[w.feature],
        note: `Selected: ${w.feature}`,
      };
    },
  });

  const features = [
    "They are very small.",
    "They are the biggest animal in South America.",
    "They have huge front teeth.",
    "They have thin tails.",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q31 · Beaver Zoological Anatomy & Adaptation 3D"
      subtitle="Examine the 3D biological adaptations that enable beavers to fell trees and build dams"
      hints={["Look for the sentence that describes what a beaver looks like.", "Which feature does the passage call remarkable?"]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Zoological Anatomy Chart · Rodentia</span>
                <span className="text-[11px] font-medium text-slate-500">Distinctive Physical Adaptations</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
              🦫 Feature: Huge Front Teeth
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 2.4, 4.6], fov: 45 }}>
            <BeaverHabitat3D position={[0, 0, 0]} />
            <Avatar3D position={[1.2, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#D97706" hairStyle="cap" pose="kneeling" />
          </World3D>
        </div>

        {/* Feature Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f) => {
            const active = play.world.feature === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => !play.locked && play.set({ feature: f })}
                className={`w-full p-3.5 rounded-xl border-2 text-left font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${
                  active
                    ? "border-amber-600 bg-amber-50 text-amber-950 shadow-md ring-2 ring-amber-200"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-xs"
                }`}
              >
                <span>{f}</span>
              </button>
            );
          })}
        </div>

        {/* Selector Bay */}
        <Bay label="Confirm Distinctive Anatomical Feature" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {features.map((f) => (
              <WordPill
                key={f}
                text={f}
                tone="amber"
                selected={play.world.feature === f}
                onClick={() => play.set({ feature: f })}
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
   Q32 — Ecological Impact in South America (adversely affected)
   Question: "What was the outcome of transporting beavers to South America?"
   Options:
     A. They were hunted by wild animals.
     B. The business was successful.
     C. They adversely affected the environment.
     D. All of these -> Key: C (They adversely affected the environment.)
   ══════════════════════════════════════════════════════════════════════ */
export function Q32PatagoniaEcoImpactActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ outcome?: string }>({
    question,
    initial: { outcome: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.outcome) return { note: "Select the ecological consequence in South America" };
      const map: Record<string, string> = {
        "They were hunted by wild animals.": "A",
        "The business was successful.": "B",
        "They adversely affected the environment.": "C",
        "All of these": "D",
      };
      return {
        value: w.outcome,
        optionId: map[w.outcome],
        note: `Selected: ${w.outcome}`,
      };
    },
  });

  const outcomes = [
    "They were hunted by wild animals.",
    "The business was successful.",
    "They adversely affected the environment.",
    "All of these",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q32 · Patagonia Ecological Impact Assessment 3D"
      subtitle="Analyze the 3D environmental landscape and identify the disruption caused by non-native introduction"
      hints={["Find the part of the passage about beavers in Patagonia.", "Did the fur business succeed? What happened to the forests?"]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-rose-200/80 bg-gradient-to-b from-rose-50/80 via-amber-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                <TreePine className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-950 uppercase tracking-wider block">Ecological Impact Assessment</span>
                <span className="text-[11px] font-medium text-slate-500">Tierra del Fuego Ecosystem Alteration</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-300">
              ⚠️ Outcome: Adverse Ecological Impact
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 2.8, 5.2], fov: 45 }}>
            <GlacierExpedition3D position={[0, 0, 0]} />
            <Avatar3D position={[0.7, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#DC2626" expression="worried" pose="standing" />
          </World3D>
        </div>

        {/* Impact Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {outcomes.map((o) => {
            const active = play.world.outcome === o;
            return (
              <button
                key={o}
                type="button"
                onClick={() => !play.locked && play.set({ outcome: o })}
                className={`p-3.5 rounded-xl border-2 text-left font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${
                  active
                    ? "border-rose-600 bg-rose-50 text-rose-950 shadow-md ring-2 ring-rose-200"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-xs"
                }`}
              >
                <span>{o}</span>
              </button>
            );
          })}
        </div>

        {/* Selector Bay */}
        <Bay label="Confirm Ecological Outcome" tone="rose">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {outcomes.map((o) => (
              <WordPill
                key={o}
                text={o}
                tone="rose"
                selected={play.world.outcome === o}
                onClick={() => play.set({ outcome: o })}
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
   Q33 — Purpose of Beaver Dams (protection and food)
   Question: "Why do beavers make dams?"
   Options:
     A. To make their teeth more strong
     B. They are too big to swim in rivers without dams.
     C. For protection and food
     D. To live in the wild -> Key: C (For protection and food)
   ══════════════════════════════════════════════════════════════════════ */
export function Q33DamFunctionActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ purpose?: string }>({
    question,
    initial: { purpose: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.purpose) return { note: "Select the primary purpose of dam construction" };
      const map: Record<string, string> = {
        "To make their teeth more strong": "A",
        "They are too big to swim in rivers without dams.": "B",
        "For protection and food": "C",
        "To live in the wild": "D",
      };
      return {
        value: w.purpose,
        optionId: map[w.purpose],
        note: `Selected: ${w.purpose}`,
      };
    },
  });

  const purposes = [
    "To make their teeth more strong",
    "They are too big to swim in rivers without dams.",
    "For protection and food",
    "To live in the wild",
  ];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q33 · Beaver Engineering: Dam Architecture 3D"
      subtitle="Examine the 3D dam construction and determine the dual survival benefits: protection and winter food"
      hints={["Find the sentence that explains what the dam does for the beaver.", "Think about both safety and food."]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">Eco-Architecture Cross-Section</span>
                <span className="text-[11px] font-medium text-slate-500">Lodge Fortress & Winter Food Cache</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
              🛡️ Purpose: Protection & Food
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 2.6, 5.0], fov: 45 }}>
            <BeaverHabitat3D position={[0, 0, 0]} />
            <Avatar3D position={[-1.3, 0, 0.5]} rotation={[0, 0.7, 0]} shirtColor="#059669" hairStyle="short" pose="gesturing" />
          </World3D>
        </div>

        {/* Purpose Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {purposes.map((p) => {
            const active = play.world.purpose === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => !play.locked && play.set({ purpose: p })}
                className={`p-3.5 rounded-xl border-2 text-left font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${
                  active
                    ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-md ring-2 ring-emerald-200"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-xs"
                }`}
              >
                <span>{p}</span>
              </button>
            );
          })}
        </div>

        {/* Selector Bay */}
        <Bay label="Confirm Dam Purpose" tone="emerald">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {purposes.map((p) => (
              <WordPill
                key={p}
                text={p}
                tone="emerald"
                selected={play.world.purpose === p}
                onClick={() => play.set({ purpose: p })}
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
   Q34 — Relocation to Goa (Moved)
   Sentence: "How are you? I have ______ to a new house and I now live in Goa."
   Options: A. change, B. moved, C. calculated, D. paused -> Key: B (moved)
   ══════════════════════════════════════════════════════════════════════ */
export function Q34GoaRelocationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the verb expressing relocation" };
      const map: Record<string, string> = { change: "A", moved: "B", calculated: "C", paused: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["change", "moved", "calculated", "paused"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q34 · Moving to Sunny Goa 3D"
      subtitle="Complete the email greeting announcing the family's house relocation to sunny Goa"
      hints={["The writer now lives in a new house in Goa.", "Which verb describes going to live in a new home?"]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-sky-200/80 bg-gradient-to-b from-sky-50/80 via-teal-50/40 to-amber-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                <Truck className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">Email to Friend · New Home in Goa</span>
                <span className="text-[11px] font-medium text-slate-500">Section 4: Contextual Cloze Email</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-300">
              🌴 Welcome to Goa
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <GoaVilla3D position={[0, 0, 0]} />
            <Avatar3D position={[0.8, 0, 0.5]} rotation={[0, -0.6, 0]} shirtColor="#0284C7" hairStyle="cap" pose="standing" />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-sky-50/80 border-2 border-sky-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            How are you? I have{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            to a new house and I now live in Goa.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Relocation Verb" tone="sky">
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
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q35 — Hospitality Invitation (Visit)
   Sentence: "This means I live much closer to you and I hope that you can ______ more often."
   Options: A. visit, B. travel, C. accommodate, D. borrow -> Key: A (visit)
   ══════════════════════════════════════════════════════════════════════ */
export function Q35HospitalityInviteActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the verb expressing a social visit" };
      const map: Record<string, string> = { visit: "A", travel: "B", accommodate: "C", borrow: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["visit", "travel", "accommodate", "borrow"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q35 · Goa Verandah & Hospitality Invitation 3D"
      subtitle="Complete the friendly invite encouraging frequent visits now that the distance is reduced"
      hints={["The writer now lives closer and hopes the friend will come to see them more often.", "Which verb means to go and see someone?"]}
    >
      <Board>
        {/* 3D Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-slate-50/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 p-4 bg-white/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">Friendship GPS Route · Close Distance</span>
                <span className="text-[11px] font-medium text-slate-500">Encouraging Frequent Weekend Visits</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
              💌 Invite: Visit More Often
            </span>
          </div>

          <World3D cue={play.world} height="280px" camera={{ position: [0, 2.5, 4.8], fov: 45 }}>
            <VillaVerandah3D position={[0, 0, 0]} />
            <Avatar3D position={[0.8, 0, 0.4]} rotation={[0, -0.6, 0]} shirtColor="#059669" hairStyle="ponytail" pose="gesturing" />
          </World3D>
        </div>

        {/* Sentence Prompt */}
        <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            This means I live much closer to you and I hope that you can{" "}
            <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
            more often.
          </p>
        </div>

        {/* Selector Bay */}
        <Bay label="Select Hospitality Verb" tone="emerald">
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

"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, PlayCanvas, World3D, WordPill, SentenceSlot, Bay } from "./kit";
import { MessageSquare, Wrench, Footprints, AlertCircle, Sparkles } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q41 — Schoolyard Accident Inquiry (Section 5: Spoken & Written)
   Dialogue: Mother: "Oh, dear! ______ you fall over? You have bruised your knee!" / Son: "Yes!"
   Options: A. Did, B. Do, C. Don't, D. How -> Key: A (Did)
   ══════════════════════════════════════════════════════════════════════ */
export function Q41AccidentResponseActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ aux?: string }>({
    question,
    initial: { aux: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.aux) return { note: "Select the past inquiry auxiliary" };
      const map: Record<string, string> = { Did: "A", Do: "B", "Don't": "C", How: "D" };
      return {
        value: w.aux,
        optionId: map[w.aux],
        note: w.aux === "Did" ? "Correct past simple question: 'Did you fall over?'" : `Selected: ${w.aux}`,
      };
    },
  });

  const auxs = ["Did", "Do", "Don't", "How"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q41 · Schoolyard First-Aid Inquiry"
      subtitle="Complete the concerned question asking about the past accident"
      hints={["To ask whether an event occurred in the past before a base verb ('fall over'), use auxiliary 'Did'."]}
    >
      <Board>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-900 font-bold text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 text-red-700" />
            <span>Injury Observation: Bruised Knee ➔ Mother's Concern</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center space-y-2">
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            Mother: "Oh, dear! <SentenceSlot value={play.world.aux} filled={!!play.world.aux} /> you fall over? You have bruised your knee!"
          </p>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">Son: "Yes!"</p>
        </div>

        <Bay label="Inquiry Auxiliary Selector" tone="purple">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {auxs.map((a) => (
              <WordPill
                key={a}
                text={a}
                tone="purple"
                selected={play.world.aux === a}
                onClick={() => play.set({ aux: a })}
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
   Q42 — Character Personality Detective ('Nosey')
   Dialogue: Rob: "How do you like Mr Williams?" / Christy: "Oh! That old man is always asking questions. He is so ______."
   Options: A. spatial, B. repentant, C. nosey, D. punctual -> Key: C (nosey)
   ══════════════════════════════════════════════════════════════════════ */
export function Q42NoseyCharacterActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ adj?: string }>({
    question,
    initial: { adj: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.adj) return { note: "Select the personality adjective" };
      const map: Record<string, string> = { spatial: "A", repentant: "B", nosey: "C", punctual: "D" };
      return {
        value: w.adj,
        optionId: map[w.adj],
        note: w.adj === "nosey" ? "Correct: 'nosey' describes someone overly curious who constantly asks prying questions" : `Selected: ${w.adj}`,
      };
    },
  });

  const adjs = ["spatial", "repentant", "nosey", "punctual"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q42 · Character Trait Detective"
      subtitle="Identify the trait describing someone who constantly asks prying questions"
      hints={["Someone who intrudes into other people's affairs with unwanted questions is 'nosey'."]}
    >
      <Board>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-amber-900">Trait Clue: "Always asking questions about personal business"</span>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center space-y-2">
          <p className="text-xs sm:text-sm text-slate-600 font-medium">Rob: "How do you like Mr Williams?"</p>
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            Christy: "Oh! That old man is always asking questions. He is so{" "}
            <SentenceSlot value={play.world.adj} filled={!!play.world.adj} />."
          </p>
        </div>

        <Bay label="Personality Trait Selector" tone="amber">
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
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q43 — Dinner Invitation Dialogue (Social Register)
   Dialogue: Jenna: "Are you free for dinner in the evening?" / Shetty: "______"
   Options: A. No problem., B. Yes, I can., C. Why?, D. Certainly. What time in the evening? -> Key: D
   ══════════════════════════════════════════════════════════════════════ */
export function Q43DinnerInvitationActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ reply?: string }>({
    question,
    initial: { reply: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.reply) return { note: "Select the polite conversational response" };
      const map: Record<string, string> = {
        "No problem.": "A",
        "Yes, I can.": "B",
        "Why?": "C",
        "Certainly. What time in the evening?": "D",
      };
      return {
        value: w.reply,
        optionId: map[w.reply],
        note: w.reply?.includes("Certainly") ? "Correct: Polite acceptance accompanied by time coordination" : `Selected: ${w.reply}`,
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
      title="Q43 · Dinner Invitation Exchange"
      subtitle="Select the naturally polite and constructive social response"
      hints={["'Certainly. What time in the evening?' is the standard courteous acceptance for a dinner invitation."]}
    >
      <Board>
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-900 font-bold text-xs sm:text-sm">
            <MessageSquare className="w-4 h-4 text-sky-700" />
            <span>Social Invitation: Evening Dinner Gathering</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-800">Jenna: "Are you free for dinner in the evening?"</p>
          <p className="text-sm sm:text-base font-bold text-purple-900 leading-relaxed">
            Shetty: "{play.world.reply || "____________________"}"
          </p>
        </div>

        <Bay label="Conversational Response Selector" tone="sky">
          <div className="flex flex-col items-center gap-2 w-full max-w-xl mx-auto">
            {replies.map((r) => (
              <WordPill
                key={r}
                text={r}
                tone="sky"
                selected={play.world.reply === r}
                onClick={() => play.set({ reply: r })}
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
   Q44 — Bicycle Proverb Workshop ('Saves nine')
   Dialogue: Mary: "Fix your bike right away. Don't leave it for the weekend." / Tim: "Yes, a stitch in time ______."
   Options: A. make nine, B. saves time, C. makes time, D. saves nine -> Key: D (saves nine)
   ══════════════════════════════════════════════════════════════════════ */
export function Q44ProverbWorkshopActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ completion?: string }>({
    question,
    initial: { completion: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.completion) return { note: "Complete the traditional English proverb" };
      const map: Record<string, string> = { "make nine": "A", "saves time": "B", "makes time": "C", "saves nine": "D" };
      return {
        value: w.completion,
        optionId: map[w.completion],
        note: w.completion === "saves nine" ? "Correct proverb: 'A stitch in time saves nine'" : `Selected: ${w.completion}`,
      };
    },
  });

  const completions = ["make nine", "saves time", "makes time", "saves nine"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q44 · Proverb Workshop"
      subtitle="Complete the classic English adage on timely preventative maintenance"
      hints={["The traditional proverb is 'A stitch in time saves nine', meaning fixing small issues early prevents big disasters."]}
    >
      <Board>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
            <Wrench className="w-4 h-4 text-amber-700" />
            <span>Workshop Wisdom: Bicycle Chain Maintenance</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center space-y-2">
          <p className="text-xs sm:text-sm text-slate-600 font-medium">Mary: "Fix your bike right away. Don't leave it for the weekend."</p>
          <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            Tim: "Yes, a stitch in time <SentenceSlot value={play.world.completion} filled={!!play.world.completion} />."
          </p>
        </div>

        <Bay label="Proverb Ending Selector" tone="amber">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {completions.map((c) => (
              <WordPill
                key={c}
                text={c}
                tone="amber"
                selected={play.world.completion === c}
                onClick={() => play.set({ completion: c })}
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
   Q45 — Hiking Trail Negative Agreement ('Neither')
   Dialogue: Alan: "I am so tired. I don't feel like walking any more." / Sherry: "______"
   Options: A. as well as, B. also, C. neither, D. no -> Key: C (neither)
   ══════════════════════════════════════════════════════════════════════ */
export function Q45AgreementDialogueActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ particle?: string }>({
    question,
    initial: { particle: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.particle) return { note: "Select the negative agreement response" };
      const map: Record<string, string> = { "as well as": "A", also: "B", neither: "C", no: "D" };
      return {
        value: w.particle,
        optionId: map[w.particle],
        note: w.particle === "neither" ? "Correct: 'Me neither' agrees with negative statement ('don't feel like')" : `Selected: ${w.particle}`,
      };
    },
  });

  const particles = ["as well as", "also", "neither", "no"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q45 · Hiking Trail Agreement"
      subtitle="Concur with Alan's negative fatigue statement"
      hints={["To agree with a negative statement ('I don't feel like...'), we use '(Me) neither'."]}
    >
      <Board>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
            <Footprints className="w-4 h-4 text-emerald-700" />
            <span>Trail Distance: 12 km Hiked ➔ Hikers resting on log</span>
          </div>
        </div>

        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-800">Alan: "I am so tired. I don't feel like walking any more."</p>
          <p className="text-sm sm:text-base font-bold text-purple-900 leading-relaxed">
            Sherry: "Me <SentenceSlot value={play.world.particle} filled={!!play.world.particle} />."
          </p>
        </div>

        <Bay label="Agreement Particle Selector" tone="emerald">
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
      </Board>
    </Shell>
  );
}

"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay } from "./kit";
import { Palette, Utensils, Volume2, ShieldAlert, Fish, Sparkles, VolumeX, AlertTriangle, Waves } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   Q21 — Art Studio Replicating Painting (Precision Vocabulary)
   Sentence: "That is such a pretty picture. I would like to try and ______ it."
   Options: A. repeal, B. revitalise, C. replicate, D. reimburse -> Key: C (replicate)
   ══════════════════════════════════════════════════════════════════════ */
export function Q21ArtStudioActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ verb?: string }>({
    question,
    initial: { verb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.verb) return { note: "Select the vocabulary term meaning to make an exact copy" };
      const map: Record<string, string> = { repeal: "A", revitalise: "B", replicate: "C", reimburse: "D" };
      return {
        value: w.verb,
        optionId: map[w.verb],
        note: w.verb === "replicate" ? "Correct: 'replicate' means to reproduce, duplicate, or copy an artwork accurately" : `Selected: ${w.verb}`,
      };
    },
  });

  const verbs = ["repeal", "revitalise", "replicate", "reimburse"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q21 · Masterpiece Art Studio Replication"
      subtitle="Select the precise verb describing copying or reproducing an artwork"
      hints={["'Replicate' means to make an exact replica, reproduction, or copy of an existing work."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-purple-200/80 bg-gradient-to-b from-purple-50/80 via-pink-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                <Palette className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Fine Arts Studio · Easel Station</span>
                <span className="text-[11px] font-medium text-slate-500">Master Canvas Reproduction Project</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-purple-100 text-purple-900 border border-purple-300">
              🎨 Target: Replicate
            </span>
          </div>

          {/* Art Easel Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-purple-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-amber-50 via-purple-50 to-slate-100 border border-purple-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Left: Original Artwork on Easel */}
                  <g transform="translate(60, 20)">
                    {/* Wooden Easel Legs */}
                    <line x1="20" y1="140" x2="45" y2="20" stroke="#92400E" strokeWidth="3" />
                    <line x1="70" y1="140" x2="45" y2="20" stroke="#92400E" strokeWidth="3" />
                    {/* Picture Canvas Frame */}
                    <rect x="5" y="30" width="80" height="60" rx="3" fill="#FFFFFF" stroke="#D97706" strokeWidth="3" />
                    {/* Scenic landscape painted inside */}
                    <path d="M 10 70 Q 30 50 50 65 T 80 55 L 80 85 L 10 85 Z" fill="#22C55E" />
                    <circle cx="65" cy="45" r="10" fill="#FBBF24" />
                    <text x="45" y="105" textAnchor="middle" fill="#78350F" fontSize="8" fontWeight="bold">ORIGINAL</text>
                  </g>

                  {/* Arrow Copying */}
                  <g transform="translate(180, 70)">
                    <path d="M 0 10 L 18 10 L 18 2 L 30 15 L 18 28 L 18 20 L 0 20 Z" fill="#8B5CF6" />
                    <text x="15" y="-5" textAnchor="middle" fill="#7C3AED" fontSize="8" fontWeight="bold">COPY</text>
                  </g>

                  {/* Right: Artist Painting Replica */}
                  <g transform="translate(230, 20)">
                    {/* Easel 2 */}
                    <line x1="20" y1="140" x2="45" y2="20" stroke="#92400E" strokeWidth="3" />
                    <line x1="70" y1="140" x2="45" y2="20" stroke="#92400E" strokeWidth="3" />
                    <rect x="5" y="30" width="80" height="60" rx="3" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="3,3" />
                    {/* Artist avatar in progress */}
                    <g transform="translate(70, 45)">
                      <circle cx="15" cy="15" r="10" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                      {/* Artist Beret */}
                      <ellipse cx="15" cy="9" rx="14" ry="4" fill="#7C3AED" />
                      <path d="M 8 25 L 2 55 L 28 55 L 22 25 Z" fill="#6366F1" />
                      {/* Brush in hand */}
                      <line x1="5" y1="35" x2="-10" y2="25" stroke="#78350F" strokeWidth="2" />
                      <circle cx="-10" cy="25" r="2" fill="#EF4444" />
                    </g>
                    <text x="45" y="105" textAnchor="middle" fill="#6D28D9" fontSize="8" fontWeight="bold">REPLICA</text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-purple-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block mb-1">Vocabulary Precision</span>
                <div className="text-xs text-slate-700 font-mono bg-purple-50/70 p-2.5 rounded-lg border border-purple-200/60 leading-relaxed">
                  <span className="text-purple-600 font-bold">replicate</span> = duplicate / copy exactly
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Repeal" means revoke a law; "reimburse" means pay back money; "replicate" means reproduce.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-purple-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              That is such a pretty picture. I would like to try and{" "}
              <SentenceSlot value={play.world.verb} filled={!!play.world.verb} />{" "}
              it.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Precise Verb" tone="purple">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {verbs.map((v) => (
                  <WordPill
                    key={v}
                    text={v}
                    tone="purple"
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
   Q22 — Cake Overeating Regret ('If only')
   Sentence: "If ______ I had not eaten that last piece of cake. I feel so full."
   Options: A. barely, B. never, C. ever, D. only -> Key: D (only)
   ══════════════════════════════════════════════════════════════════════ */
export function Q22CakeRegretActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ adverb?: string }>({
    question,
    initial: { adverb: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.adverb) return { note: "Select the word completing the idiom of regret" };
      const map: Record<string, string> = { barely: "A", never: "B", ever: "C", only: "D" };
      return {
        value: w.adverb,
        optionId: map[w.adverb],
        note: w.adverb === "only" ? "Correct: 'If only' expresses strong hypothetical wish or regret about the past" : `Selected: ${w.adverb}`,
      };
    },
  });

  const adverbs = ["barely", "never", "ever", "only"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q22 · Post-Feast Regret Expression"
      subtitle="Complete the idiom of regret describing overeating at the dessert table"
      hints={["'If only...' is a fixed English expression used to convey deep regret about an action already done."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                <Utensils className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">Dessert Table · Regret Meter</span>
                <span className="text-[11px] font-medium text-slate-500">Feeling Overstuffed After Extra Slice</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
              🍰 Idiom: If only...
            </span>
          </div>

          {/* Dessert Plate & Avatar with Stomachache Scene */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-amber-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-amber-50 via-rose-50 to-orange-100 border border-amber-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Dining Table Surface */}
                  <ellipse cx="190" cy="140" rx="170" ry="35" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />

                  {/* Empty Plate with Crumbs */}
                  <ellipse cx="250" cy="135" rx="45" ry="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                  {/* Chocolate cake crumbs */}
                  <circle cx="235" cy="133" r="2" fill="#78350F" />
                  <circle cx="250" cy="136" r="3" fill="#78350F" />
                  <circle cx="265" cy="132" r="1.5" fill="#78350F" />
                  {/* Fork resting */}
                  <line x1="280" y1="120" x2="300" y2="145" stroke="#94A3B8" strokeWidth="2" />

                  {/* Full diner holding tummy */}
                  <g transform="translate(90, 50)">
                    <circle cx="25" cy="22" r="14" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
                    {/* Distressed eyebrows */}
                    <line x1="16" y1="16" x2="22" y2="19" stroke="#1E293B" strokeWidth="1.5" />
                    <line x1="34" y1="16" x2="28" y2="19" stroke="#1E293B" strokeWidth="1.5" />
                    <circle cx="19" cy="22" r="1.5" fill="#1E293B" />
                    <circle cx="31" cy="22" r="1.5" fill="#1E293B" />
                    {/* Wavy mouth */}
                    <path d="M 20 30 Q 25 26 30 30" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    {/* Puffed body / stomach */}
                    <ellipse cx="25" cy="62" rx="24" ry="20" fill="#3B82F6" />
                    {/* Hands on belly */}
                    <path d="M 5 55 Q 25 68 45 55" stroke="#FED7AA" strokeWidth="4" strokeLinecap="round" fill="none" />
                  </g>

                  {/* Thought Bubble */}
                  <g transform="translate(140, 10)">
                    <rect x="0" y="0" width="180" height="32" rx="10" fill="#FFFFFF" stroke="#EA580C" strokeWidth="1.5" />
                    <text x="90" y="20" textAnchor="middle" fill="#C2410C" fontSize="10" fontWeight="bold">
                      "If only I hadn't eaten it! 😣"
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">Idiomatic Regret Formula</span>
                <div className="text-xs text-slate-700 font-mono bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
                  <span className="text-amber-600 font-bold">If only</span> + past perfect [had not eaten]
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "If only" introduces a heartfelt wish that past events had occurred differently.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-amber-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              If{" "}
              <SentenceSlot value={play.world.adverb} filled={!!play.world.adverb} />{" "}
              I had not eaten that last piece of cake. I feel so full.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Regret Particle" tone="amber">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {adverbs.map((a) => (
                  <WordPill
                    key={a}
                    text={a}
                    tone="amber"
                    selected={play.world.adverb === a}
                    onClick={() => play.set({ adverb: a })}
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
   Q23 — Sound Perception (Audible)
   Sentence: "The music was so quiet, it was barely ______."
   Options: A. amicable, B. audible, C. atrocious, D. averse -> Key: B (audible)
   ══════════════════════════════════════════════════════════════════════ */
export function Q23QuietSoundActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ adj?: string }>({
    question,
    initial: { adj: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.adj) return { note: "Select the sensory adjective related to hearing sounds" };
      const map: Record<string, string> = { amicable: "A", audible: "B", atrocious: "C", averse: "D" };
      return {
        value: w.adj,
        optionId: map[w.adj],
        note: w.adj === "audible" ? "Correct: 'audible' means loud enough to be heard" : `Selected: ${w.adj}`,
      };
    },
  });

  const adjs = ["amicable", "audible", "atrocious", "averse"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q23 · Sound Perception & Acoustic Meter"
      subtitle="Identify the hearing-related adjective describing faint or barely perceptible music"
      hints={["'Audible' stems from Latin 'audire' (to hear) and means capable of being heard."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-sky-200/80 bg-gradient-to-b from-sky-50/80 via-indigo-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                <Volume2 className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">Acoustic Testing Chamber</span>
                <span className="text-[11px] font-medium text-slate-500">Decibel Level: 5 dB · Faint Whisper Range</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-300">
              🔊 Volume: Barely Audible
            </span>
          </div>

          {/* Sound Waves & Headphones Graphic */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-slate-900 rounded-xl border border-sky-800 p-4 shadow-inner">
              <div className="relative h-48 rounded-lg bg-slate-950 border border-sky-600/40 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Speaker on left emitting tiny soundwaves */}
                  <g transform="translate(50, 60)">
                    {/* Speaker Body */}
                    <rect x="0" y="10" width="30" height="40" rx="3" fill="#334155" stroke="#64748B" strokeWidth="2" />
                    <polygon points="30,15 50,0 50,60 30,45" fill="#475569" stroke="#64748B" strokeWidth="2" />
                    {/* Faint sound waves */}
                    <path d="M 60 15 Q 70 30 60 45" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3,3" fill="none" opacity="0.5" />
                    <path d="M 75 8 Q 90 30 75 52" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3,3" fill="none" opacity="0.3" />
                  </g>

                  {/* Decibel Meter Visualizer in center */}
                  <g transform="translate(160, 50)">
                    <rect x="0" y="0" width="120" height="60" rx="6" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
                    <text x="60" y="20" textAnchor="middle" fill="#38BDF8" fontSize="9" fontFamily="monospace">SOUND LEVEL</text>
                    {/* Level bars */}
                    <rect x="20" y="32" width="12" height="15" rx="2" fill="#10B981" />
                    <rect x="36" y="32" width="12" height="15" rx="2" fill="#334155" opacity="0.3" />
                    <rect x="52" y="32" width="12" height="15" rx="2" fill="#334155" opacity="0.3" />
                    <rect x="68" y="32" width="12" height="15" rx="2" fill="#334155" opacity="0.3" />
                    <rect x="84" y="32" width="12" height="15" rx="2" fill="#334155" opacity="0.3" />
                    <text x="60" y="55" textAnchor="middle" fill="#94A3B8" fontSize="7" fontFamily="monospace">LOW INTENSITY</text>
                  </g>

                  {/* Listener leaning in with ear cupped */}
                  <g transform="translate(300, 55)">
                    <circle cx="20" cy="20" r="14" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                    {/* Cupped hand to ear */}
                    <path d="M 6 12 Q 2 20 6 28" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <circle cx="16" cy="20" r="1.5" fill="#1E293B" />
                    <path d="M 12 28 Q 18 28 24 28" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-sky-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block mb-1">Acoustic Terminology</span>
                <div className="text-xs text-slate-700 font-mono bg-sky-50/70 p-2.5 rounded-lg border border-sky-200/60 leading-relaxed">
                  <span className="text-blue-600 font-bold">audible</span> = able to be heard by human ear
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Barely audible" means the sound is at the very threshold of being heard.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-sky-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              The music was so quiet, it was barely{" "}
              <SentenceSlot value={play.world.adj} filled={!!play.world.adj} />.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Sensory Adjective" tone="sky">
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
   Q24 — School Detention Expectation (Modal 'Should')
   Sentence: "He ______ get a detention for being so badly behaved."
   Options: A. should, B. won't, C. shan't, D. ought -> Key: A (should)
   ══════════════════════════════════════════════════════════════════════ */
export function Q24SchoolDisciplineActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ modal?: string }>({
    question,
    initial: { modal: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.modal) return { note: "Select the modal verb expressing expected consequence" };
      const map: Record<string, string> = { should: "A", "won't": "B", "shan't": "C", ought: "D" };
      return {
        value: w.modal,
        optionId: map[w.modal],
        note: w.modal === "should" ? "Correct: 'should' expresses a deserved or expected disciplinary outcome" : `Selected: ${w.modal}`,
      };
    },
  });

  const modals = ["should", "won't", "shan't", "ought"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q24 · School Conduct & Disciplinary Policy"
      subtitle="Identify the modal verb expressing a justified disciplinary consequence"
      hints={["'Should + base verb' is used to express what is fitting, proper, or deserved according to rules."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-rose-200/80 bg-gradient-to-b from-rose-50/80 via-orange-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-950 uppercase tracking-wider block">Principal's Office · Code of Conduct</span>
                <span className="text-[11px] font-medium text-slate-500">Evaluation of Disruptive Behavior</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-300">
              📋 Modal: Should (Deserved Consequence)
            </span>
          </div>

          {/* School Notice & Classroom Scene */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-white/90 backdrop-blur-xs rounded-xl border border-rose-100 p-4 shadow-xs">
              <div className="relative h-48 rounded-xl bg-gradient-to-b from-slate-100 via-rose-50 to-amber-50 border border-rose-300/60 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Notice Board */}
                  <rect x="40" y="20" width="160" height="125" rx="6" fill="#FEF3C7" stroke="#92400E" strokeWidth="3" />
                  <rect x="50" y="32" width="140" height="20" rx="3" fill="#DC2626" />
                  <text x="120" y="46" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">DETENTION NOTICE</text>
                  <text x="60" y="70" fill="#78350F" fontSize="8">• Infraction: Disruptive behavior</text>
                  <text x="60" y="85" fill="#78350F" fontSize="8">• Consequence: Detention room</text>
                  <text x="60" y="100" fill="#78350F" fontSize="8">• Rule 4.2 Code of Conduct</text>
                  <text x="60" y="125" fill="#DC2626" fontSize="9" fontWeight="bold">RECOMMENDATION: SHOULD</text>

                  {/* Student Avatar reflecting */}
                  <g transform="translate(240, 45)">
                    <circle cx="30" cy="22" r="14" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                    {/* Downcast eyes */}
                    <line x1="22" y1="22" x2="26" y2="25" stroke="#1E293B" strokeWidth="1.5" />
                    <line x1="38" y1="22" x2="34" y2="25" stroke="#1E293B" strokeWidth="1.5" />
                    <path d="M 24 30 Q 30 26 36 30" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    {/* School uniform */}
                    <path d="M 18 36 L 10 75 L 50 75 L 42 36 Z" fill="#1E3A8A" />
                    <polygon points="30,36 26,50 34,50" fill="#DC2626" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block mb-1">Modal of Expectation</span>
                <div className="text-xs text-slate-700 font-mono bg-rose-50/70 p-2.5 rounded-lg border border-rose-200/60 leading-relaxed">
                  He + <span className="text-purple-600 font-bold">should</span> + get a detention
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Ought" requires "to" (ought to get), so "should" is the single correct modal for base verb "get".
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-rose-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              He{" "}
              <SentenceSlot value={play.world.modal} filled={!!play.world.modal} />{" "}
              get a detention for being so badly behaved.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Modal Verb" tone="rose">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {modals.map((m) => (
                  <WordPill
                    key={m}
                    text={m}
                    tone="rose"
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
   Q25 — Oceanic Biology Adjective (Marine)
   Sentence: "There is a lot of ______ life in the sea. Some of the creatures are strange."
   Options: A. wharf, B. marina, C. quay, D. marine -> Key: D (marine)
   ══════════════════════════════════════════════════════════════════════ */
export function Q25MarineCreaturesActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ adj?: string }>({
    question,
    initial: { adj: undefined },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.adj) return { note: "Select the adjective relating to the sea and ocean life" };
      const map: Record<string, string> = { wharf: "A", marina: "B", quay: "C", marine: "D" };
      return {
        value: w.adj,
        optionId: map[w.adj],
        note: w.adj === "marine" ? "Correct: 'marine life' is the scientific collocation for oceanic fauna" : `Selected: ${w.adj}`,
      };
    },
  });

  const adjs = ["wharf", "marina", "quay", "marine"];

  return (
    <Shell
      dim="2D"
      play={play}
      question={question}
      title="Q25 · Deep Ocean Marine Biology Expedition"
      subtitle="Select the correct adjective modifying ocean life and deep-sea creatures"
      hints={["'Marine' relates directly to the sea or ocean (as in 'marine life', 'marine biologist')."]}
    >
      <Board>
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-cyan-200/80 bg-gradient-to-b from-cyan-50/80 via-blue-50/40 to-slate-50/50 p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-xs">
                <Fish className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-cyan-950 uppercase tracking-wider block">Oceanographic Research Submersible</span>
                <span className="text-[11px] font-medium text-slate-500">Exploring Deep Sea Biodiversity</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-cyan-100 text-cyan-900 border border-cyan-300">
              🌊 Collocation: Marine Life
            </span>
          </div>

          {/* Oceanic Panorama Scene */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 bg-slate-900 rounded-xl border border-cyan-700 p-4 shadow-inner">
              <div className="relative h-48 rounded-lg bg-gradient-to-b from-cyan-900 via-blue-950 to-slate-950 border border-cyan-500/40 flex items-center justify-center p-2 overflow-hidden">
                <svg viewBox="0 0 380 180" className="w-full h-full">
                  {/* Sunlight rays filtering into water */}
                  <polygon points="40,0 90,0 120,180 70,180" fill="#38BDF8" opacity="0.1" />
                  <polygon points="140,0 180,0 220,180 180,180" fill="#38BDF8" opacity="0.1" />

                  {/* Coral reef seabed */}
                  <path d="M 0 160 Q 60 145 120 155 T 240 150 T 380 165 L 380 180 L 0 180 Z" fill="#F43F5E" opacity="0.8" />

                  {/* Sea turtle swimming */}
                  <g transform="translate(60, 65)">
                    <ellipse cx="25" cy="18" rx="18" ry="12" fill="#059669" stroke="#047857" strokeWidth="1" />
                    <circle cx="44" cy="18" r="6" fill="#10B981" />
                    <polygon points="20,8 30,0 35,8" fill="#10B981" />
                    <polygon points="20,28 30,36 35,28" fill="#10B981" />
                  </g>

                  {/* Jellyfish */}
                  <g transform="translate(180, 40)">
                    <path d="M 10 20 Q 25 0 40 20 Z" fill="#E879F9" opacity="0.8" />
                    <path d="M 16 20 Q 14 40 18 55" stroke="#F472B6" strokeWidth="1.5" fill="none" />
                    <path d="M 25 20 Q 28 40 23 58" stroke="#F472B6" strokeWidth="1.5" fill="none" />
                    <path d="M 34 20 Q 32 40 36 55" stroke="#F472B6" strokeWidth="1.5" fill="none" />
                  </g>

                  {/* School of colourful tropical fish */}
                  {[
                    { x: 260, y: 70, c: "#FBBF24" },
                    { x: 290, y: 85, c: "#38BDF8" },
                    { x: 320, y: 65, c: "#FB7185" },
                  ].map((f, i) => (
                    <g key={i} transform={`translate(${f.x}, ${f.y})`}>
                      <ellipse cx="12" cy="8" rx="10" ry="5" fill={f.c} />
                      <polygon points="2,8 -4,2 -4,14" fill={f.c} />
                      <circle cx="16" cy="7" r="1.5" fill="#1E293B" />
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-white rounded-xl border border-cyan-200 p-4 shadow-xs">
                <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider block mb-1">Ocean Adjective Collocation</span>
                <div className="text-xs text-slate-700 font-mono bg-cyan-50/70 p-2.5 rounded-lg border border-cyan-200/60 leading-relaxed">
                  <span className="text-cyan-600 font-bold">marine</span> life = sea flora & fauna
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  "Wharf", "marina", and "quay" are nouns for human docking structures; "marine" is the appropriate descriptive adjective.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Prompt */}
          <div className="mt-5 rounded-xl border-2 border-cyan-300/80 bg-white p-4 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              There is a lot of{" "}
              <SentenceSlot value={play.world.adj} filled={!!play.world.adj} />{" "}
              life in the sea. Some of the creatures are strange.
            </p>
          </div>

          {/* Selector Bay */}
          <div className="mt-4">
            <Bay label="Select Oceanic Adjective" tone="sky">
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

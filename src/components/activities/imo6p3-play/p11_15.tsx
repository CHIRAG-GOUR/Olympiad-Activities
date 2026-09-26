"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Cog,
  Target,
  BookOpen,
  Users,
  Grid,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ListOrdered,
  Layers,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q11 — ⚙️ Operator Factory (Mathematical Substitution)
   ══════════════════════════════════════════════════════════════════════ */
interface Q11World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q11OperatorFactoryActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q11World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "D";
      const val = w.chosenOption === "A" ? 7 : w.chosenOption === "B" ? 12 : w.chosenOption === "C" ? 5 : 0;

      return {
        value: `${val} (24 ÷ 8 + 7 − 2 × 5 = ${val})`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, val) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! 24 ÷ 8 + 7 − 2 × 5 = 3 + 7 − 10 = 10 − 10 = 0."
          : `Selected ${val}. Apply BODMAS order: division and multiplication before addition and subtraction.`,
      };
    },
  });

  return (
    <PlayShell
      title="Operator Factory"
      mission="Substitute each letter with its mathematical operator and evaluate the expression using BODMAS."
      icon={Cog}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Evaluated Result" value={world.chosenOption === "D" ? "0 (Option D)" : world.chosenOption === "A" ? "7 (Option A)" : world.chosenOption === "B" ? "12 (Option B)" : "5 (Option C)"} />}
    >
      <div className="space-y-4">
        {/* Operator Mapping & Expression Dashboard */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-200 shadow-sm flex flex-col items-center">
          <div className="text-xs font-mono font-bold text-slate-500 mb-2">Original Alphanumeric Expression:</div>
          <div className="font-mono text-2xl sm:text-3xl font-black text-slate-800 tracking-wider py-1">
            24 <span className="text-indigo-600">R</span> 8{" "}
            <span className="text-emerald-600">S</span> 7{" "}
            <span className="text-rose-600">M</span> 2{" "}
            <span className="text-amber-600">P</span> 5
          </div>

          {/* Rule Key */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-lg my-3">
            <div className="p-2 bg-indigo-100/70 border border-indigo-300 rounded-lg text-center">
              <span className="text-xs font-mono font-bold text-indigo-900">R = ÷ (Divide)</span>
            </div>
            <div className="p-2 bg-emerald-100/70 border border-emerald-300 rounded-lg text-center">
              <span className="text-xs font-mono font-bold text-emerald-900">S = + (Add)</span>
            </div>
            <div className="p-2 bg-rose-100/70 border border-rose-300 rounded-lg text-center">
              <span className="text-xs font-mono font-bold text-rose-900">M = − (Subtract)</span>
            </div>
            <div className="p-2 bg-amber-100/70 border border-amber-300 rounded-lg text-center">
              <span className="text-xs font-mono font-bold text-amber-900">P = × (Multiply)</span>
            </div>
          </div>

          <div className="w-full max-w-md border-t border-indigo-200 pt-3 text-center">
            <div className="text-xs font-mono text-slate-500 mb-1">Step-by-Step BODMAS Proof:</div>
            <div className="font-mono text-sm text-slate-700 font-bold">
              24 ÷ 8 + 7 − (2 × 5) &nbsp;=&nbsp; 3 + 7 − 10 &nbsp;=&nbsp; 10 − 10 &nbsp;=&nbsp; <span className="text-indigo-600 font-black">0</span>
            </div>
          </div>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Final Calculated Value (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, val: 7, desc: "Ignored final multiplication", },
              { id: "B" as const, val: 12, desc: "Left-to-right calculation error", },
              { id: "C" as const, val: 5, desc: "Subtracted before multiplying", },
              { id: "D" as const, val: 0, desc: "3 + 7 − 10 = 0", },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center ${
                    isSelected ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                  <span className="text-2xl font-black text-slate-800 my-1">{opt.val}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{opt.desc}</span>
                  <span
                    className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded w-full ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Option " + opt.id}
                  </span>
                </button>
              );
            })}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q12 — 🎯 Geometric Dot Laboratory (Dot Situation)
   ══════════════════════════════════════════════════════════════════════ */
interface Q12World {
  selectedOption: "A" | "B" | "C" | "D";
}

export function Q12GeometricDotLaboratoryActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q12World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { selectedOption: "A" },
    derive: (w) => {
      const isCorrect = w.selectedOption === "A";
      return {
        value: `Figure ${w.selectedOption} — ${
          isCorrect
            ? "Dot in (Circle ∩ Triangle only) AND (Triangle ∩ Square only)"
            : "Does not contain both specified overlap regions"
        }`,
        optionId: matchOption(question, w.selectedOption) ?? matchText(question, w.selectedOption) ?? w.selectedOption,
        note: isCorrect
          ? "Correct! Figure A provides independent intersection regions for (Circle ∩ Triangle outside Square) and (Triangle ∩ Square outside Circle)."
          : `Option ${w.selectedOption} fails one of the required dot placement conditions.`,
      };
    },
  });

  return (
    <PlayShell
      title="Geometric Dot Laboratory"
      mission="Inspect the dot containment conditions in Figure (X) and identify the matching figure from the options."
      icon={Target}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Selected Figure" value={`Option ${world.selectedOption}`} />}
    >
      <div className="space-y-4">
        {/* Figure X Reference Canvas */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="inline-block bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-xs mb-1">
              Reference Figure (X)
            </div>
            <p className="text-xs text-slate-600 font-medium max-w-sm">
              Contains 2 Dots:
              <br />• <b>Dot 1</b>: Inside <b>Circle & Triangle only</b> (outside square).
              <br />• <b>Dot 2</b>: Inside <b>Triangle & Square only</b> (outside circle).
            </p>
          </div>
          <svg viewBox="0 0 100 80" className="w-28 h-24 bg-white rounded-lg border-2 border-indigo-300 p-1 shadow-inner shrink-0">
            <circle cx="35" cy="40" r="22" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <polygon points="50,15 85,65 15,65" fill="none" stroke="#ef4444" strokeWidth="2" />
            <rect x="40" y="25" width="45" height="45" fill="none" stroke="#8b5cf6" strokeWidth="2" />
            {/* Dot 1 (Circle & Triangle only) */}
            <circle cx="34" cy="46" r="3.5" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
            {/* Dot 2 (Triangle & Square only) */}
            <circle cx="62" cy="52" r="3.5" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
          </svg>
        </div>

        {/* 4 Candidate Option Cards with Full SVG Artwork */}
        <Bay label="Candidate Figures (Select Option A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                id: "A" as const,
                title: "Option A",
                subtitle: "Contains both 2-shape intersections",
                renderSvg: () => (
                  <svg viewBox="0 0 100 90" className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <circle cx="35" cy="45" r="24" fill="none" stroke="#3b82f6" strokeWidth="1.8" />
                    <polygon points="50,15 90,75 10,75" fill="none" stroke="#ef4444" strokeWidth="1.8" />
                    <rect x="42" y="30" width="45" height="45" fill="none" stroke="#8b5cf6" strokeWidth="1.8" />
                    <circle cx="32" cy="52" r="3" fill="#f59e0b" />
                    <circle cx="65" cy="56" r="3" fill="#f59e0b" />
                  </svg>
                ),
              },
              {
                id: "B" as const,
                title: "Option B",
                subtitle: "Triangle inside Square entirely",
                renderSvg: () => (
                  <svg viewBox="0 0 100 90" className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <rect x="10" y="10" width="80" height="70" fill="none" stroke="#8b5cf6" strokeWidth="1.8" />
                    <polygon points="50,20 80,65 20,65" fill="none" stroke="#ef4444" strokeWidth="1.8" />
                    <circle cx="50" cy="45" r="18" fill="none" stroke="#3b82f6" strokeWidth="1.8" />
                  </svg>
                ),
              },
              {
                id: "C" as const,
                title: "Option C",
                subtitle: "Circle and Square separated",
                renderSvg: () => (
                  <svg viewBox="0 0 100 90" className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <circle cx="28" cy="45" r="20" fill="none" stroke="#3b82f6" strokeWidth="1.8" />
                    <rect x="52" y="25" width="40" height="40" fill="none" stroke="#8b5cf6" strokeWidth="1.8" />
                    <polygon points="50,10 85,80 15,80" fill="none" stroke="#ef4444" strokeWidth="1.8" />
                  </svg>
                ),
              },
              {
                id: "D" as const,
                title: "Option D",
                subtitle: "No pure Circle-Triangle overlap",
                renderSvg: () => (
                  <svg viewBox="0 0 100 90" className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <polygon points="50,15 90,75 10,75" fill="none" stroke="#ef4444" strokeWidth="1.8" />
                    <circle cx="50" cy="48" r="16" fill="none" stroke="#3b82f6" strokeWidth="1.8" />
                    <rect x="25" y="25" width="50" height="50" fill="none" stroke="#8b5cf6" strokeWidth="1.8" />
                  </svg>
                ),
              },
            ].map((opt) => {
              const isSelected = world.selectedOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => set({ selectedOption: opt.id })}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center ${
                    isSelected ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-xs text-slate-800">{opt.title}</span>
                    {isSelected && (<span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">Selected</span>)}
                  </div>

                  {opt.renderSvg()}

                  <span className="text-[10px] text-slate-500 font-medium mt-1">{opt.subtitle}</span>
                  <button
                    type="button"
                    className={`mt-2 text-[10px] font-bold px-2 py-1 rounded w-full transition-colors ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Option " + opt.id}
                  </button>
                </div>
              );
            })}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q13 — 📚 Dictionary Conveyor
   ══════════════════════════════════════════════════════════════════════ */
interface Q13World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q13DictionaryConveyorActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const WORDS = [
    { num: 1, word: "Fight" },
    { num: 2, word: "Freak" },
    { num: 3, word: "Faint" },
    { num: 4, word: "Fault" },
    { num: 5, word: "Flick" },
  ];

  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q13World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "D";
      const seq =
        w.chosenOption === "A"
          ? "3, 1, 4, 5, 2"
          : w.chosenOption === "B"
          ? "4, 3, 1, 5, 2"
          : w.chosenOption === "C"
          ? "3, 4, 5, 1, 2"
          : "3, 4, 1, 5, 2";

      return {
        value: `${seq} (Faint → Fault → Fight → Flick → Freak)`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! Alphabetical order: 3. Faint (F-a-i) → 4. Fault (F-a-u) → 1. Fight (F-i) → 5. Flick (F-l) → 2. Freak (F-r) = 3, 4, 1, 5, 2."
          : `Selected sequence ${seq}. Compare prefixes 'Fa-', 'Fi-', 'Fl-', 'Fr-'.`,
      };
    },
  });

  return (
    <PlayShell
      title="Dictionary Conveyor"
      mission="Arrange the five words in standard alphabetical dictionary order."
      icon={BookOpen}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Dictionary Sequence" value={world.chosenOption === "D" ? "3, 4, 1, 5, 2 (Option D)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Word Cards Display */}
        <Bay label="Original Word List with Number IDs">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center py-2">
            {WORDS.map((item) => (
              <div
                key={item.num}
                className="p-3 bg-white border-2 border-indigo-200 rounded-xl shadow-xs flex flex-col items-center justify-between"
              >
                <span className="text-[10px] font-mono text-indigo-600 font-bold">
                  Word #{item.num}
                </span>
                <span className="font-mono font-black text-base text-slate-800 my-1">
                  {item.word}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  Pref: {item.word.slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </Bay>

        {/* 4 Option Buttons */}
        <Bay label="Select the Correct Dictionary Order (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, seq: "3, 1, 4, 5, 2", desc: "Faint → Fight → Fault...", },
              { id: "B" as const, seq: "4, 3, 1, 5, 2", desc: "Fault before Faint error", },
              { id: "C" as const, seq: "3, 4, 5, 1, 2", desc: "Flick before Fight error", },
              { id: "D" as const, seq: "3, 4, 1, 5, 2", desc: "Faint → Fault → Fight → Flick → Freak", },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center ${
                    isSelected ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                  <span className="text-base font-black text-slate-800 my-1 font-mono">{opt.seq}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{opt.desc}</span>
                  <span
                    className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded w-full ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Option " + opt.id}
                  </span>
                </button>
              );
            })}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q14 — 👨‍👩‍👧 Family Detective (Blood Relations)
   ══════════════════════════════════════════════════════════════════════ */
interface Q14World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q14FamilyDetectiveActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q14World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "D";
      const rel =
        w.chosenOption === "A"
          ? "Father"
          : w.chosenOption === "B"
          ? "Uncle"
          : w.chosenOption === "C"
          ? "Maternal Uncle"
          : "Brother";

      return {
        value: `${rel} (Amar is Brother to Girl's Mother)`,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, rel) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! 'Only daughter of my mother' = Amar's sister (who is the girl's mother). Therefore, Amar is the Brother of the girl's mother."
          : `Selected ${rel}. Note: The question asks for Amar's relation to the girl's MOTHER, not to the girl herself.`,
      };
    },
  });

  return (
    <PlayShell
      title="Family Detective"
      mission="Trace the blood relations in Amar's statement: 'Her mother is the only daughter of my mother.'"
      icon={Users}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Relation to Girl's Mother" value={world.chosenOption === "D" ? "Brother (Option D)" : `Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Family Tree Diagram */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-200 flex flex-col items-center shadow-sm">
          <svg viewBox="0 0 320 160" className="w-full max-w-md h-40 bg-white rounded-lg border border-slate-200 shadow-inner">
            {/* Generation 1: Amar's Mother */}
            <circle cx="160" cy="30" r="18" fill="#a855f7" />
            <text x="160" y="34" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">Amar's Mother</text>

            {/* Generation 2: Amar & Sister (Girl's Mother) */}
            <circle cx="80" cy="95" r="18" fill="#3b82f6" />
            <text x="80" y="99" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">Amar</text>

            <circle cx="240" cy="95" r="18" fill="#ec4899" />
            <text x="240" y="99" fill="white" fontSize="8.5" fontWeight="bold" textAnchor="middle">Girl's Mother</text>

            {/* Generation 3: Girl */}
            <circle cx="240" cy="140" r="12" fill="#f43f5e" />
            <text x="240" y="143" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">Girl</text>

            {/* Tree Lines */}
            <line x1="160" y1="48" x2="80" y2="77" stroke="#94a3b8" strokeWidth="2" />
            <line x1="160" y1="48" x2="240" y2="77" stroke="#94a3b8" strokeWidth="2" />
            <line x1="240" y1="113" x2="240" y2="128" stroke="#94a3b8" strokeWidth="2" />

            {/* Sibling Relation Line */}
            <line x1="98" y1="95" x2="222" y2="95" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 3" />
            <rect x="125" y="85" width="70" height="20" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
            <text x="160" y="98" fill="#b45309" fontSize="9" fontWeight="black" textAnchor="middle">
              Siblings (Brother)
            </text>
          </svg>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="How is Amar Related to the Girl's Mother?">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, rel: "Father", },
              { id: "B" as const, rel: "Uncle", },
              { id: "C" as const, rel: "Maternal Uncle", desc: "Relation to girl (not mother)", },
              { id: "D" as const, rel: "Brother", desc: "Amar is her Brother", },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center ${
                    isSelected ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                  <span className="text-base font-black text-slate-800 my-1">{opt.rel}</span>
                  {opt.desc && <span className="text-[10px] text-slate-500 font-medium">{opt.desc}</span>}
                  <span
                    className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded w-full ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Option " + opt.id}
                  </span>
                </button>
              );
            })}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q15 — 🧩 Figure Matrix (Visual 3×3 Grid)
   ══════════════════════════════════════════════════════════════════════ */
interface Q15World {
  selectedCell: "A" | "B" | "C" | "D";
}

export function Q15MatrixLaboratoryActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q15World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { selectedCell: "C" },
    derive: (w) => {
      const isCorrect = w.selectedCell === "C";
      const desc =
        w.selectedCell === "C"
          ? "Diamond with shaded right sector & central cross"
          : w.selectedCell === "A"
          ? "Circle with 2 top dots"
          : w.selectedCell === "B"
          ? "Square with bottom triangle"
          : "Dual concentric circle";

      return {
        value: `Option ${w.selectedCell} — ${desc}`,
        optionId: matchOption(question, w.selectedCell) ?? matchText(question, w.selectedCell) ?? w.selectedCell,
        note: isCorrect
          ? "Correct! Row 3 combines diamond outer geometry with clockwise 90° sector shading progression and inner cross."
          : `Option ${w.selectedCell} does not complete the row-column geometry progression.`,
      };
    },
  });

  return (
    <PlayShell
      title="Figure Matrix Laboratory"
      mission="Analyze row and column transformations to construct the missing 9th cell in the 3×3 matrix."
      icon={Grid}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="9th Cell Figure" value={`Option ${world.selectedCell}`} />}
    >
      <div className="space-y-4">
        {/* 3×3 Visual Matrix Canvas */}
        <div className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 border border-violet-200 p-4 rounded-xl flex justify-center shadow-sm">
          <div className="grid grid-cols-3 gap-2.5 max-w-sm w-full">
            {/* Row 1: Circles */}
            <div className="aspect-square bg-white rounded-lg border border-slate-300 p-2 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-9 h-9">
                <circle cx="20" cy="20" r="16" fill="none" stroke="#6366f1" strokeWidth="2" />
                <path d="M 20 20 L 20 4 A 16 16 0 0 1 36 20 Z" fill="#818cf8" />
              </svg>
            </div>
            <div className="aspect-square bg-white rounded-lg border border-slate-300 p-2 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-9 h-9">
                <circle cx="20" cy="20" r="16" fill="none" stroke="#6366f1" strokeWidth="2" />
                <path d="M 20 20 L 36 20 A 16 16 0 0 1 20 36 Z" fill="#818cf8" />
              </svg>
            </div>
            <div className="aspect-square bg-white rounded-lg border border-slate-300 p-2 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-9 h-9">
                <circle cx="20" cy="20" r="16" fill="none" stroke="#6366f1" strokeWidth="2" />
                <path d="M 20 20 L 20 36 A 16 16 0 0 1 4 20 Z" fill="#818cf8" />
              </svg>
            </div>

            {/* Row 2: Squares */}
            <div className="aspect-square bg-white rounded-lg border border-slate-300 p-2 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-9 h-9">
                <rect x="6" y="6" width="28" height="28" fill="none" stroke="#ec4899" strokeWidth="2" />
                <polygon points="6,6 20,20 6,34" fill="#f472b6" />
              </svg>
            </div>
            <div className="aspect-square bg-white rounded-lg border border-slate-300 p-2 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-9 h-9">
                <rect x="6" y="6" width="28" height="28" fill="none" stroke="#ec4899" strokeWidth="2" />
                <polygon points="6,6 34,6 20,20" fill="#f472b6" />
              </svg>
            </div>
            <div className="aspect-square bg-white rounded-lg border border-slate-300 p-2 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-9 h-9">
                <rect x="6" y="6" width="28" height="28" fill="none" stroke="#ec4899" strokeWidth="2" />
                <polygon points="34,6 34,34 20,20" fill="#f472b6" />
              </svg>
            </div>

            {/* Row 3: Diamonds */}
            <div className="aspect-square bg-white rounded-lg border border-slate-300 p-2 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-9 h-9">
                <rect x="10" y="10" width="20" height="20" transform="rotate(45 20 20)" fill="none" stroke="#10b981" strokeWidth="2" />
                <polygon points="20,6 20,20 6,20" fill="#34d399" />
              </svg>
            </div>
            <div className="aspect-square bg-white rounded-lg border border-slate-300 p-2 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-9 h-9">
                <rect x="10" y="10" width="20" height="20" transform="rotate(45 20 20)" fill="none" stroke="#10b981" strokeWidth="2" />
                <polygon points="20,6 34,20 20,20" fill="#34d399" />
              </svg>
            </div>

            {/* Cell 9 (Interactive ?) */}
            <div className="aspect-square bg-indigo-100/90 border-2 border-indigo-500 rounded-lg p-2 flex flex-col items-center justify-center shadow-md">
              <span className="text-[10px] text-indigo-700 font-black">Cell ?</span>
              <span className="font-mono text-xs font-bold text-indigo-900">
                Opt {world.selectedCell}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Candidate Figure Cards */}
        <Bay label="Candidate Figures for the 9th Cell (Select A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                id: "A" as const,
                title: "Option A",
                subtitle: "Circle with 2 Dots",
                renderSvg: () => (
                  <svg viewBox="0 0 60 60" className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <circle cx="30" cy="30" r="22" fill="none" stroke="#64748b" strokeWidth="2" />
                    <circle cx="22" cy="22" r="3" fill="#64748b" />
                    <circle cx="38" cy="22" r="3" fill="#64748b" />
                  </svg>
                ),
              },
              {
                id: "B" as const,
                title: "Option B",
                subtitle: "Square + Triangle",
                renderSvg: () => (
                  <svg viewBox="0 0 60 60" className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <rect x="10" y="10" width="40" height="40" fill="none" stroke="#64748b" strokeWidth="2" />
                    <polygon points="30,30 45,45 15,45" fill="#64748b" />
                  </svg>
                ),
              },
              {
                id: "C" as const,
                title: "Option C",
                subtitle: "Diamond + Shaded Right Sector & Cross",
                renderSvg: () => (
                  <svg viewBox="0 0 60 60" className="w-14 h-14 bg-emerald-50 border border-slate-200 rounded-lg p-1">
                    <rect x="15" y="15" width="30" height="30" transform="rotate(45 30 30)" fill="none" stroke="#059669" strokeWidth="2.5" />
                    <polygon points="30,9 51,30 30,30" fill="#10b981" />
                    <line x1="30" y1="12" x2="30" y2="48" stroke="#059669" strokeWidth="1.5" />
                    <line x1="12" y1="30" x2="48" y2="30" stroke="#059669" strokeWidth="1.5" />
                  </svg>
                ),
              },
              {
                id: "D" as const,
                title: "Option D",
                subtitle: "Dual Concentric Circle",
                renderSvg: () => (
                  <svg viewBox="0 0 60 60" className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <circle cx="30" cy="30" r="22" fill="none" stroke="#64748b" strokeWidth="2" />
                    <circle cx="30" cy="30" r="12" fill="none" stroke="#64748b" strokeWidth="2" />
                  </svg>
                ),
              },
            ].map((opt) => {
              const isSelected = world.selectedCell === opt.id;
              const isC = opt.id === "C";

              return (
                <div
                  key={opt.id}
                  onClick={() => set({ selectedCell: opt.id })}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center ${
                    isSelected ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-xs text-slate-800">{opt.title}</span>
                    {isSelected && (<span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">Selected</span>)}
                  </div>

                  {opt.renderSvg()}

                  <span className="text-[10px] text-slate-500 font-medium mt-1">{opt.subtitle}</span>
                  <button
                    type="button"
                    className={`mt-2 text-[10px] font-bold px-2 py-1 rounded w-full transition-colors ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected ? "Selected" : "Pick " + opt.id}
                  </button>
                </div>
              );
            })}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

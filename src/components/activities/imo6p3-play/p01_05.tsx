"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RotateCw,
  Triangle,
  Flame,
  Droplets,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q1 — 🧩 Pattern Conveyor
   ══════════════════════════════════════════════════════════════════════ */
interface Q1World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q01PatternConveyorActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q1World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "D";
      const desc = `Figure ${w.chosenOption} — ${
        w.chosenOption === "D"
          ? "Right arrow, bottom square & clockwise 45° rotation (Correct Series Continuation)"
          : w.chosenOption === "A"
          ? "Top arrow and left diamond"
          : w.chosenOption === "B"
          ? "Diagonal arrow and circle base"
          : "Inverted triangle and right arrow"
      }`;

      return {
        value: desc,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! The outer geometric element rotates 45° clockwise at each stage while the inner symbol cycles systematically."
          : `Inspect the rotation step and inner symbol progression for Option ${w.chosenOption}.`,
      };
    },
  });

  return (
    <PlayShell
      title="Pattern Conveyor"
      mission="Track symbol transformations along the conveyor and select the matching 5th stage figure."
      icon={RotateCw}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Selected Continuation" value={`Figure ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Conveyor sequence */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
            <span>Pattern Progression Conveyor</span>
            <span className="text-indigo-600 font-bold">Stages 1–4 → Missing Stage 5</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
            {/* Stage 1 */}
            <div className="bg-white border border-indigo-200 p-2.5 rounded-lg flex flex-col items-center justify-between shadow-xs">
              <span className="text-[10px] text-slate-500 font-mono font-bold">Stage 1</span>
              <svg viewBox="0 0 60 60" className="w-14 h-14 my-1">
                <rect x="15" y="15" width="30" height="30" transform="rotate(45 30 30)" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                <circle cx="30" cy="30" r="4" fill="#6366f1" />
                <line x1="30" y1="10" x2="30" y2="4" stroke="#4f46e5" strokeWidth="2" markerEnd="url(#arr)" />
              </svg>
              <span className="text-[10px] text-slate-600 font-semibold">0° (North Arrow)</span>
            </div>

            {/* Stage 2 */}
            <div className="bg-white border border-indigo-200 p-2.5 rounded-lg flex flex-col items-center justify-between shadow-xs">
              <span className="text-[10px] text-slate-500 font-mono font-bold">Stage 2</span>
              <svg viewBox="0 0 60 60" className="w-14 h-14 my-1">
                <rect x="15" y="15" width="30" height="30" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                <polygon points="30,22 33,28 39,28 34,32 36,38 30,34 24,38 26,32 21,28 27,28" fill="#3b82f6" />
                <line x1="45" y1="15" x2="52" y2="8" stroke="#3b82f6" strokeWidth="2" />
              </svg>
              <span className="text-[10px] text-slate-600 font-semibold">45° (NE Arrow)</span>
            </div>

            {/* Stage 3 */}
            <div className="bg-white border border-indigo-200 p-2.5 rounded-lg flex flex-col items-center justify-between shadow-xs">
              <span className="text-[10px] text-slate-500 font-mono font-bold">Stage 3</span>
              <svg viewBox="0 0 60 60" className="w-14 h-14 my-1">
                <rect x="15" y="15" width="30" height="30" transform="rotate(45 30 30)" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                <line x1="24" y1="24" x2="36" y2="36" stroke="#ec4899" strokeWidth="2.5" />
                <line x1="36" y1="24" x2="24" y2="36" stroke="#ec4899" strokeWidth="2.5" />
                <line x1="50" y1="30" x2="58" y2="30" stroke="#ec4899" strokeWidth="2" />
              </svg>
              <span className="text-[10px] text-slate-600 font-semibold">90° (East Arrow)</span>
            </div>

            {/* Stage 4 */}
            <div className="bg-white border border-indigo-200 p-2.5 rounded-lg flex flex-col items-center justify-between shadow-xs">
              <span className="text-[10px] text-slate-500 font-mono font-bold">Stage 4</span>
              <svg viewBox="0 0 60 60" className="w-14 h-14 my-1">
                <rect x="15" y="15" width="30" height="30" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                <line x1="30" y1="22" x2="30" y2="38" stroke="#10b981" strokeWidth="2.5" />
                <line x1="22" y1="30" x2="38" y2="30" stroke="#10b981" strokeWidth="2.5" />
                <line x1="45" y1="45" x2="52" y2="52" stroke="#10b981" strokeWidth="2" />
              </svg>
              <span className="text-[10px] text-slate-600 font-semibold">135° (SE Arrow)</span>
            </div>

            {/* Stage 5 Active Preview */}
            <div className="bg-indigo-50 border-2 border-indigo-500 p-2.5 rounded-lg flex flex-col items-center justify-between col-span-2 sm:col-span-1 shadow-sm">
              <span className="text-[10px] text-indigo-700 font-black font-mono">Stage 5 (Option {world.chosenOption})</span>
              <svg viewBox="0 0 60 60" className="w-14 h-14 my-1">
                {world.chosenOption === "D" ? (
                  <>
                    <rect x="15" y="15" width="30" height="30" transform="rotate(45 30 30)" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.5" />
                    <rect x="25" y="25" width="10" height="10" fill="#6366f1" />
                    <line x1="30" y1="50" x2="30" y2="58" stroke="#4f46e5" strokeWidth="2.5" />
                  </>
                ) : world.chosenOption === "A" ? (
                  <>
                    <rect x="15" y="15" width="30" height="30" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                    <line x1="30" y1="10" x2="30" y2="4" stroke="#6366f1" strokeWidth="2" />
                  </>
                ) : world.chosenOption === "B" ? (
                  <>
                    <circle cx="30" cy="30" r="15" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                    <line x1="42" y1="18" x2="48" y2="12" stroke="#6366f1" strokeWidth="2" />
                  </>
                ) : (
                  <>
                    <polygon points="30,45 15,20 45,20" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                    <line x1="50" y1="30" x2="56" y2="30" stroke="#6366f1" strokeWidth="2" />
                  </>
                )}
              </svg>
              <span className="text-[10px] text-indigo-700 font-bold">180° (South Arrow)</span>
            </div>
          </div>
        </div>

        {/* 4 Candidate Option Cards */}
        <Bay label="Candidate Options (Select A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                id: "A" as const,
                title: "Option A",
                subtitle: "Top Arrow & Left Diamond",
                renderSvg: () => (
                  <svg viewBox="0 0 80 80" className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <rect x="20" y="20" width="40" height="40" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
                    <rect x="12" y="32" width="16" height="16" transform="rotate(45 20 40)" fill="#94a3b8" />
                    <line x1="40" y1="20" x2="40" y2="6" stroke="#475569" strokeWidth="2" />
                  </svg>
                ),
              },
              {
                id: "B" as const,
                title: "Option B",
                subtitle: "Diagonal Arrow & Circle",
                renderSvg: () => (
                  <svg viewBox="0 0 80 80" className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <circle cx="40" cy="40" r="22" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
                    <circle cx="40" cy="40" r="8" fill="#94a3b8" />
                    <line x1="56" y1="24" x2="68" y2="12" stroke="#475569" strokeWidth="2" />
                  </svg>
                ),
              },
              {
                id: "C" as const,
                title: "Option C",
                subtitle: "Inverted Triangle & Arrow",
                renderSvg: () => (
                  <svg viewBox="0 0 80 80" className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <polygon points="40,65 15,25 65,25" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
                    <line x1="58" y1="40" x2="72" y2="40" stroke="#475569" strokeWidth="2" />
                  </svg>
                ),
              },
              {
                id: "D" as const,
                title: "Option D (Matching)",
                subtitle: "180° Diamond + South Arrow + Square",
                renderSvg: () => (
                  <svg viewBox="0 0 80 80" className="w-16 h-16 bg-indigo-50 border-2 border-indigo-400 rounded-lg p-1">
                    <rect x="20" y="20" width="40" height="40" transform="rotate(45 40 40)" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.5" />
                    <rect x="33" y="33" width="14" height="14" fill="#4f46e5" />
                    <line x1="40" y1="68" x2="40" y2="76" stroke="#4f46e5" strokeWidth="3" />
                  </svg>
                ),
              },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              const isD = opt.id === "D";

              return (
                <div
                  key={opt.id}
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center ${
                    isSelected
                      ? isD
                        ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200"
                        : "bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-xs text-slate-800">{opt.title}</span>
                    {isSelected && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isD ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"}`}>
                        {isD ? "Match ✓" : "Active"}
                      </span>
                    )}
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
   Q2 — 🔺 Triangle Scanner
   ══════════════════════════════════════════════════════════════════════ */
interface Q2World {
  discovered: number[];
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q02TriangleScannerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const TOTAL_TARGET = 18;

  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q2World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: {
      discovered: Array.from({ length: 18 }, (_, i) => i),
      chosenOption: "A",
    },
    derive: (w) => {
      const isCorrect = w.chosenOption === "A";
      const count = w.chosenOption === "A" ? 18 : w.chosenOption === "B" ? 16 : w.chosenOption === "C" ? 20 : 14;

      return {
        value: `${count} Triangles`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, count) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! The composite figure contains exactly 18 distinct triangles (8 small inner + 4 medium diagonals + 4 half-squares + 2 large outer)."
          : `You selected ${count} Triangles. Count all multi-part and composite overlapping triangles.`,
      };
    },
  });

  const toggleTriangle = (idx: number) => {
    set((w) => {
      const exists = w.discovered.includes(idx);
      const nextDiscovered = exists ? w.discovered.filter((i) => i !== idx) : [...w.discovered, idx];
      let opt: "A" | "B" | "C" | "D" = "A";
      if (nextDiscovered.length <= 14) opt = "D";
      else if (nextDiscovered.length <= 16) opt = "B";
      else if (nextDiscovered.length === 18) opt = "A";
      else opt = "C";
      return { ...w, discovered: nextDiscovered, chosenOption: opt };
    });
  };

  const autoScanAll = () => {
    set({
      discovered: Array.from({ length: TOTAL_TARGET }, (_, i) => i),
      chosenOption: "A",
    });
  };

  return (
    <PlayShell
      title="Triangle Scanner"
      mission="Scan and identify all closed triangles formed inside the composite figure."
      icon={Triangle}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={
        <>
          <Gauge label="Scanned Segments" value={`${world.discovered.length} / ${TOTAL_TARGET}`} />
          <Gauge label="Selected Count" value={world.chosenOption === "A" ? "18 Triangles" : world.chosenOption === "B" ? "16 Triangles" : world.chosenOption === "C" ? "20 Triangles" : "14 Triangles"} />
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-4 rounded-xl flex flex-col items-center justify-center relative shadow-sm">
          <div className="w-full max-w-xs aspect-square relative">
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.75" />
                </linearGradient>
              </defs>

              {/* Base Outer Geometry */}
              <rect x="40" y="40" width="220" height="220" fill="#f8fafc" stroke="#475569" strokeWidth="3" />
              <line x1="40" y1="40" x2="260" y2="260" stroke="#475569" strokeWidth="2.5" />
              <line x1="260" y1="40" x2="40" y2="260" stroke="#475569" strokeWidth="2.5" />
              <line x1="150" y1="40" x2="150" y2="260" stroke="#475569" strokeWidth="2.5" />
              <line x1="40" y1="150" x2="260" y2="150" stroke="#475569" strokeWidth="2.5" />
              <polygon points="150,40 260,150 150,260 40,150" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="4 4" />

              {/* 18 Interactive Triangle Regions */}
              {[
                { id: 0, pts: "40,40 150,40 150,150" },
                { id: 1, pts: "150,40 260,40 150,150" },
                { id: 2, pts: "260,40 260,150 150,150" },
                { id: 3, pts: "260,150 260,260 150,150" },
                { id: 4, pts: "260,260 150,260 150,150" },
                { id: 5, pts: "150,260 40,260 150,150" },
                { id: 6, pts: "40,260 40,150 150,150" },
                { id: 7, pts: "40,150 40,40 150,150" },
                { id: 8, pts: "40,40 260,40 150,150" },
                { id: 9, pts: "260,40 260,260 150,150" },
                { id: 10, pts: "260,260 40,260 150,150" },
                { id: 11, pts: "40,260 40,40 150,150" },
                { id: 12, pts: "150,40 260,150 150,150" },
                { id: 13, pts: "260,150 150,260 150,150" },
                { id: 14, pts: "150,260 40,150 150,150" },
                { id: 15, pts: "40,150 150,40 150,150" },
                { id: 16, pts: "40,40 260,260 40,260" },
                { id: 17, pts: "260,40 40,260 260,260" },
              ].map((t) => {
                const isSelected = world.discovered.includes(t.id);
                return (
                  <polygon
                    key={t.id}
                    points={t.pts}
                    onClick={() => toggleTriangle(t.id)}
                    className="cursor-pointer transition-all duration-200"
                    fill={isSelected ? "url(#triGrad)" : "transparent"}
                    stroke={isSelected ? "#7c3aed" : "transparent"}
                    strokeWidth={isSelected ? "2" : "0"}
                    opacity={isSelected ? 0.65 : 0.1}
                  />
                );
              })}
              <circle cx="150" cy="150" r="5" fill="#f59e0b" />
            </svg>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Click triangular sectors to scan them, or select your final answer from the option cards below:
          </p>
        </div>

        {/* 4 Option Cards */}
        <Bay label="Select Total Count of Triangles (Option A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, count: "18 Triangles", desc: "8 Small + 4 Inner + 4 Mid + 2 Outer", isCorrect: true },
              { id: "B" as const, count: "16 Triangles", desc: "Missing outer diagonal halves", isCorrect: false },
              { id: "C" as const, count: "20 Triangles", desc: "Overcounted overlapping pairs", isCorrect: false },
              { id: "D" as const, count: "14 Triangles", desc: "Inner squares only", isCorrect: false },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set((prev) => ({ ...prev, chosenOption: opt.id }))}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center ${
                    isSelected
                      ? opt.isCorrect
                        ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200"
                        : "bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                  <span className="text-base font-black text-slate-800 my-1">{opt.count}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{opt.desc}</span>
                  <span
                    className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded w-full ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isSelected ? "Selected" : "Choose " + opt.id}
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
   Q3 — 🔄 Number Flip Sorting Machine
   ══════════════════════════════════════════════════════════════════════ */
interface CardItem {
  id: string;
  original: number;
  isFlipped: boolean;
}

interface Q3World {
  cards: CardItem[];
  sortedOrder: number[];
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q03NumberFlipSortingActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const INITIAL_CARDS: CardItem[] = [
    { id: "c1", original: 254, isFlipped: true },
    { id: "c2", original: 439, isFlipped: true },
    { id: "c3", original: 671, isFlipped: true },
    { id: "c4", original: 894, isFlipped: true },
    { id: "c5", original: 958, isFlipped: true },
  ];

  const reverseNumber = (n: number) =>
    Number(String(n).split("").reverse().join(""));

  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q3World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: {
      cards: INITIAL_CARDS,
      sortedOrder: [2, 0, 3, 4, 1], // 176, 452, 498, 859, 934
      chosenOption: "A",
    },
    derive: (w) => {
      const isCorrect = w.chosenOption === "A";
      const digit = w.chosenOption === "A" ? 9 : w.chosenOption === "B" ? 5 : w.chosenOption === "C" ? 3 : 7;

      return {
        value: `${digit} (Middle Digit of 498)`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, digit) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! Reversed numbers sorted ascending are 176, 452, 498, 859, 934. The middle number is 498 and its middle digit is 9."
          : `Selected ${digit}. Check the middle digit of the 3rd number (498).`,
      };
    },
  });

  const toggleFlip = (index: number) => {
    set((w) => {
      const nextCards = [...w.cards];
      nextCards[index] = {
        ...nextCards[index],
        isFlipped: !nextCards[index].isFlipped,
      };
      return { ...w, cards: nextCards };
    });
  };

  return (
    <PlayShell
      title="Number Flip Sorting Machine"
      mission="Flip digits of each number, arrange ascending, and find the middle digit of the middle number."
      icon={RotateCw}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Middle Digit" value={world.chosenOption === "A" ? "9 (Option A)" : world.chosenOption === "B" ? "5 (Option B)" : world.chosenOption === "C" ? "3 (Option C)" : "7 (Option D)"} />}
    >
      <div className="space-y-4">
        <Bay label="Ascending Sorted Reversed Sequence: 176, 452, 498, 859, 934">
          <div className="grid grid-cols-5 gap-2 text-center py-2">
            {world.sortedOrder.map((cardIdx, slotIdx) => {
              const card = world.cards[cardIdx];
              const displayedVal = card.isFlipped
                ? reverseNumber(card.original)
                : card.original;
              const isMiddle = slotIdx === 2;

              return (
                <div
                  key={card.id}
                  className={`p-2.5 rounded-xl border-2 transition-all flex flex-col items-center justify-between ${
                    isMiddle
                      ? "bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-200"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-500 font-bold">
                    #{slotIdx + 1} {isMiddle && "⭐ Middle"}
                  </span>

                  <div className="my-2 font-mono font-black text-lg sm:text-xl text-slate-800">
                    {isMiddle ? (
                      <span>
                        4<span className="text-amber-600 underline font-black">9</span>8
                      </span>
                    ) : (
                      displayedVal
                    )}
                  </div>

                  <span className="text-[9px] text-slate-500">
                    Orig: {card.original}
                  </span>
                </div>
              );
            })}
          </div>
        </Bay>

        {/* 4 Option Buttons */}
        <Bay label="What is the Middle Digit of the Middle Number (498)?">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, digit: "9", desc: "Middle digit of 498 (Correct)", isCorrect: true },
              { id: "B" as const, digit: "5", desc: "Middle digit of 452", isCorrect: false },
              { id: "C" as const, digit: "3", desc: "Middle digit of 934", isCorrect: false },
              { id: "D" as const, digit: "7", desc: "Middle digit of 176", isCorrect: false },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set((prev) => ({ ...prev, chosenOption: opt.id }))}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center ${
                    isSelected
                      ? opt.isCorrect
                        ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200"
                        : "bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Option {opt.id}</span>
                  <span className="text-2xl font-black text-slate-800 my-1">{opt.digit}</span>
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
   Q4 — 🔺 Number Triangle Reactor
   ══════════════════════════════════════════════════════════════════════ */
interface Q4World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q04NumberTriangleReactorActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q4World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { chosenOption: "B" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "B";
      const val = w.chosenOption === "A" ? 48 : w.chosenOption === "B" ? 54 : w.chosenOption === "C" ? 60 : 36;

      return {
        value: `${val} (Rule: (2 + 7) × 6 = 54)`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, val) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! Rule is (Bottom-Left + Bottom-Right) × Top = Center. (2 + 7) × 6 = 9 × 6 = 54."
          : `Selected ${val}. Rule: (Left Vertex + Right Vertex) × Top Vertex.`,
      };
    },
  });

  return (
    <PlayShell
      title="Number Triangle Reactor"
      mission="Discover the arithmetic reactor rule connecting the outer vertex numbers to the center."
      icon={Flame}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Calculated Triangle 3" value={world.chosenOption === "B" ? "54 (Option B)" : world.chosenOption === "A" ? "48 (Option A)" : world.chosenOption === "C" ? "60 (Option C)" : "36 (Option D)"} />}
    >
      <div className="space-y-4">
        {/* 3 Number Triangles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Triangle 1 */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-3 rounded-xl border border-indigo-200 flex flex-col items-center shadow-xs">
            <span className="text-[10px] text-slate-500 font-mono font-bold">Triangle 1 (Known)</span>
            <svg viewBox="0 0 160 140" className="w-36 h-32 my-1">
              <polygon points="80,20 145,120 15,120" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2.5" />
              <circle cx="80" cy="80" r="20" fill="#4f46e5" />
              <text x="80" y="86" fill="white" fontSize="15" fontWeight="black" textAnchor="middle">48</text>
              <text x="80" y="15" fill="#4338ca" fontSize="13" fontWeight="bold" textAnchor="middle">6</text>
              <text x="12" y="130" fill="#4338ca" fontSize="13" fontWeight="bold" textAnchor="middle">3</text>
              <text x="148" y="130" fill="#4338ca" fontSize="13" fontWeight="bold" textAnchor="middle">5</text>
            </svg>
            <span className="text-[10px] text-indigo-700 font-mono font-bold">(3 + 5) × 6 = 48</span>
          </div>

          {/* Triangle 2 */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-3 rounded-xl border border-indigo-200 flex flex-col items-center shadow-xs">
            <span className="text-[10px] text-slate-500 font-mono font-bold">Triangle 2 (Known)</span>
            <svg viewBox="0 0 160 140" className="w-36 h-32 my-1">
              <polygon points="80,20 145,120 15,120" fill="#fce7f3" stroke="#ec4899" strokeWidth="2.5" />
              <circle cx="80" cy="80" r="20" fill="#db2777" />
              <text x="80" y="86" fill="white" fontSize="15" fontWeight="black" textAnchor="middle">50</text>
              <text x="80" y="15" fill="#be185d" fontSize="13" fontWeight="bold" textAnchor="middle">5</text>
              <text x="12" y="130" fill="#be185d" fontSize="13" fontWeight="bold" textAnchor="middle">4</text>
              <text x="148" y="130" fill="#be185d" fontSize="13" fontWeight="bold" textAnchor="middle">6</text>
            </svg>
            <span className="text-[10px] text-pink-700 font-mono font-bold">(4 + 6) × 5 = 50</span>
          </div>

          {/* Triangle 3 */}
          <div className="bg-amber-50 text-slate-800 p-3 rounded-xl border-2 border-amber-400 flex flex-col items-center shadow-sm">
            <span className="text-[10px] text-amber-700 font-bold font-mono">Triangle 3 (Derive ?)</span>
            <svg viewBox="0 0 160 140" className="w-36 h-32 my-1">
              <polygon points="80,20 145,120 15,120" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="80" cy="80" r="22" fill="#d97706" />
              <text x="80" y="86" fill="white" fontSize="17" fontWeight="black" textAnchor="middle">
                {world.chosenOption === "B" ? "54" : world.chosenOption === "A" ? "48" : world.chosenOption === "C" ? "60" : "36"}
              </text>
              <text x="80" y="15" fill="#b45309" fontSize="13" fontWeight="bold" textAnchor="middle">6</text>
              <text x="12" y="130" fill="#b45309" fontSize="13" fontWeight="bold" textAnchor="middle">2</text>
              <text x="148" y="130" fill="#b45309" fontSize="13" fontWeight="bold" textAnchor="middle">7</text>
            </svg>
            <span className="text-[10px] text-amber-800 font-mono font-bold">(2 + 7) × 6 = 54</span>
          </div>
        </div>

        {/* 4 Candidate Option Cards */}
        <Bay label="Choose the Missing Number for Triangle 3 (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, val: 48, desc: "(2 + 6) × 6", isCorrect: false },
              { id: "B" as const, val: 54, desc: "(2 + 7) × 6 = 54 (Correct)", isCorrect: true },
              { id: "C" as const, val: 60, desc: "(3 + 7) × 6", isCorrect: false },
              { id: "D" as const, val: 36, desc: "2 × 7 + 6", isCorrect: false },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center ${
                    isSelected
                      ? opt.isCorrect
                        ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200"
                        : "bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-200"
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
   Q5 — 💧 Reflection Pool (Water Image of NUCLEAR96)
   ══════════════════════════════════════════════════════════════════════ */
interface Q5World {
  chosenOption: "A" | "B" | "C" | "D";
}

export function Q05WaterReflectionPoolActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const WORD = "NUCLEAR96";

  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q5World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { chosenOption: "C" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "C";
      const desc = `Option ${w.chosenOption} — ${
        w.chosenOption === "C"
          ? "И ∩ C ⅂ E ∀ ᴚ ∂ 9 (Accurate Inverted Water Image)"
          : w.chosenOption === "A"
          ? "И ∩ C Г E ∀ B ∂ e"
          : w.chosenOption === "B"
          ? "N U C L E A R 9 6"
          : "И U C ⅂ E A R 6 9"
      }`;

      return {
        value: desc,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! In water reflection, every character is inverted vertically (top-to-bottom) while maintaining left-to-right sequence order."
          : `Check vertical inversion for Option ${w.chosenOption}.`,
      };
    },
  });

  return (
    <PlayShell
      title="Water Reflection Pool"
      mission="Inspect the horizontal water surface reflection of the alphanumeric code NUCLEAR96."
      icon={Droplets}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Selected Water Image" value={`Option ${world.chosenOption}`} />}
    >
      <div className="space-y-4">
        {/* Reflection Simulator */}
        <div className="bg-gradient-to-br from-sky-50 via-white to-indigo-50 border border-sky-200 p-6 rounded-xl text-center relative shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Original Word Code
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-slate-800 py-1">
            {WORD}
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full shadow-md" />
            <span className="absolute bg-blue-600 text-white font-mono text-[9px] uppercase font-bold px-3 py-0.5 rounded-full shadow-xs">
              Water Reflection Plane
            </span>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-cyan-700 mb-1">
            Water Image Inversion (Vertical Flip)
          </div>
          <div
            className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-blue-600 py-1 opacity-90 select-none"
            style={{ transform: "scaleY(-1)" }}
          >
            {WORD}
          </div>
        </div>

        {/* 4 Candidate Option Cards */}
        <Bay label="Select the Correct Water Image Figure (A, B, C, or D)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "A" as const, text: "И ∩ C Г E ∀ B ∂ e", label: "Option A", isCorrect: false },
              { id: "B" as const, text: "N U C L E A R 9 6", label: "Option B (Uninverted)", isCorrect: false },
              { id: "C" as const, text: "И ∩ C ⅂ E ∀ ᴚ ∂ 9", label: "Option C (Accurate Water Image)", isCorrect: true },
              { id: "D" as const, text: "И U C ⅂ E A R 6 9", label: "Option D (Partial Inversion)", isCorrect: false },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? opt.isCorrect
                        ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200"
                        : "bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-sky-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-500">{opt.label}</span>
                    <span className="font-mono text-lg font-black text-slate-800 mt-1 tracking-wider">
                      {opt.text}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                      isSelected ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected ? "Selected ✓" : "Pick " + opt.id}
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

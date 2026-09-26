"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Triangle,
  Layers,
  Search,
  Grid,
  Sparkles,
  Zap,
  CheckCircle2,
  Scan,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q6 — 🔺 Triangle Laser Scanner (Geometric Counting)
   Result: 16 Triangles -> "More than 12" (Option D)
   ══════════════════════════════════════════════════════════════════════ */
interface Q6World {
  scannedCount: number;
}

export function B06TriangleScannerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q6World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { scannedCount: 16 },
    derive: (w) => {
      const isMoreThan12 = w.scannedCount > 12;
      return {
        value: `${w.scannedCount} Triangles (More than 12)`,
        optionId: isMoreThan12 ? matchOption(question, "D") ?? "D" : matchOption(question, "A") ?? "A",
        note: isMoreThan12
          ? "Geometric analysis complete: 8 simple triangles + 4 composite double triangles + 4 large diagonal triangles = 16 total triangles (> 12)."
          : `Current triangle scan: ${w.scannedCount}. Trace additional composite triangles.`,
      };
    },
  });

  return (
    <PlayShell
      title="Triangle Laser Scanner"
      mission="Trace and illuminate all simple and composite triangles across the 3D transparent construction board."
      icon={Triangle}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Laser Counter" value={`${world.scannedCount} Triangles`} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
          <div className="w-full max-w-xs aspect-square relative bg-white rounded-xl border-2 border-slate-200 shadow-inner p-3">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
              <rect x="20" y="20" width="160" height="160" fill="#f8fafc" stroke="#475569" strokeWidth="2.5" />
              <line x1="20" y1="20" x2="180" y2="180" stroke="#6366f1" strokeWidth="2.5" />
              <line x1="180" y1="20" x2="20" y2="180" stroke="#6366f1" strokeWidth="2.5" />
              <line x1="100" y1="20" x2="100" y2="180" stroke="#6366f1" strokeWidth="2.5" />
              <line x1="20" y1="100" x2="180" y2="100" stroke="#6366f1" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              disabled={locked}
              onClick={() => set((w) => ({ scannedCount: Math.max(0, w.scannedCount - 1) }))}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
            >
              − Remove Triangle
            </button>
            <span className="font-mono text-base font-black text-indigo-700">{world.scannedCount}</span>
            <button
              type="button"
              disabled={locked}
              onClick={() => set((w) => ({ scannedCount: Math.min(20, w.scannedCount + 1) }))}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs shadow-sm"
            >
              + Tag Triangle
            </button>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q7 — 📄 3D Origami Simulator (Paper Folding & Cut Unfolding)
   Result: Option A
   ══════════════════════════════════════════════════════════════════════ */
interface Q7World {
  foldProgress: number; // 0 (unfolded) to 100 (folded)
  cutApplied: boolean;
  unfoldedPattern: boolean;
}

export function B07OrigamiSimulatorActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q7World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { foldProgress: 100, cutApplied: true, unfoldedPattern: true },
    derive: (w) => {
      const isComplete = w.cutApplied && w.unfoldedPattern;
      return {
        value: isComplete ? "Unfolded Diamond Geometry" : "Paper Folding in Progress",
        optionId: isComplete ? matchOption(question, "A") ?? "A" : undefined,
        note: isComplete
          ? "Unfolded sheet reveals four diamond apertures and perimeter corner cutouts matching Figure A."
          : "Execute fold sequence and unfold paper to reveal the cutout pattern.",
      };
    },
  });

  return (
    <PlayShell
      title="3D Origami Simulator"
      mission="Fold the square paper along axes X and Y, punch corner notches, and unfold to observe the exact hole pattern."
      icon={Layers}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Origami State" value={world.unfoldedPattern ? "Unfolded (Pattern A)" : "Folded"} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
          <div className="w-48 h-48 bg-white border-2 border-indigo-300 rounded-2xl flex items-center justify-center shadow-inner relative">
            <svg viewBox="0 0 100 100" className="w-36 h-36">
              {/* Unfolded Pattern A */}
              <rect x="10" y="10" width="80" height="80" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" rx="2" />
              {/* Corner Notches */}
              <polygon points="10,10 25,10 10,25" fill="#ffffff" />
              <polygon points="90,10 75,10 90,25" fill="#ffffff" />
              <polygon points="10,90 25,90 10,75" fill="#ffffff" />
              <polygon points="90,90 75,90 90,75" fill="#ffffff" />
              {/* Center Diamonds */}
              <rect x="42" y="25" width="16" height="16" transform="rotate(45 50 33)" fill="#ffffff" stroke="#4f46e5" strokeWidth="1.5" />
              <rect x="42" y="59" width="16" height="16" transform="rotate(45 50 67)" fill="#ffffff" stroke="#4f46e5" strokeWidth="1.5" />
              <rect x="25" y="42" width="16" height="16" transform="rotate(45 33 50)" fill="#ffffff" stroke="#4f46e5" strokeWidth="1.5" />
              <rect x="59" y="42" width="16" height="16" transform="rotate(45 67 50)" fill="#ffffff" stroke="#4f46e5" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={locked}
              onClick={() => set({ foldProgress: 0, cutApplied: true, unfoldedPattern: true })}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs shadow-sm"
            >
              Unfold & Render Cut Pattern
            </button>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q8 — 🤖 Security Sequence Scanner (Even Number Neighbors)
   Sequence: 5 6 # A 3 Z @ U 4 M 2 ? 6 • 8 T S © N
   Result: Two Symbols: '?' and '•' (Option C)
   ══════════════════════════════════════════════════════════════════════ */
interface Q8World {
  taggedSymbols: string[];
}

export function B08SecuritySequenceScannerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const SEQ = ["5", "6", "#", "A", "3", "Z", "@", "U", "4", "M", "2", "?", "6", "•", "8", "T", "S", "©", "N"];

  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q8World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { taggedSymbols: ["?", "•"] },
    derive: (w) => {
      const count = w.taggedSymbols.length;
      const countWord = count === 2 ? "Two" : count === 1 ? "One" : count === 3 ? "Three" : "None";
      return {
        value: `${countWord} (${w.taggedSymbols.join(", ")})`,
        optionId: count === 2 ? matchOption(question, "C") ?? "C" : matchOption(question, "A") ?? "A",
        note: count === 2
          ? "Target symbols identified: '?' (between 2 & 6) and '•' (between 6 & 8). Both are flanked by even numbers."
          : `Tagged count = ${count}. Identify symbols whose immediate neighbors are both even integers.`,
      };
    },
  });

  const toggleTag = (item: string) => {
    if (locked) return;
    set((w) => {
      const exists = w.taggedSymbols.includes(item);
      const next = exists ? w.taggedSymbols.filter((s) => s !== item) : [...w.taggedSymbols, item];
      return { ...w, taggedSymbols: next };
    });
  };

  return (
    <PlayShell
      title="Security Sequence Scanner"
      mission="Scan the conveyor belt and tag every symbol that is immediately preceded and immediately followed by an even integer."
      icon={Scan}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Tagged Qualifying Symbols" value={`${world.taggedSymbols.length} (${world.taggedSymbols.join(", ")})`} />}
    >
      <div className="space-y-4">
        {/* Conveyor Belt Display */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-2xl border border-indigo-500/30 shadow-xl overflow-x-auto">
          <div className="text-xs font-mono font-bold text-indigo-300 mb-3">Conveyor Belt Sequence Stream</div>
          <div className="flex gap-1.5 min-w-max py-2">
            {SEQ.map((char, idx) => {
              const isSymbol = ["#", "@", "?", "•", "©"].includes(char);
              const isTagged = world.taggedSymbols.includes(char);

              return (
                <div
                  key={idx}
                  onClick={() => isSymbol && toggleTag(char)}
                  className={`w-10 h-12 rounded-lg border-2 flex flex-col items-center justify-center font-mono font-black text-sm cursor-pointer transition-all ${
                    isTagged
                      ? "bg-amber-500 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-300/50"
                      : isSymbol
                      ? "bg-indigo-900/60 text-cyan-300 border-indigo-500 hover:border-cyan-300"
                      : "bg-slate-800/60 text-slate-200 border-slate-700 pointer-events-none"
                  }`}
                >
                  <span>{char}</span>
                  <span className="text-[8px] opacity-60 font-normal">#{idx + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q9 — 🪐 Shape Sorting Observatory (Geometric Grouping)
   Groups: {1, 5, 7}, {2, 4, 6}, {3, 8, 9} (Option C)
   ══════════════════════════════════════════════════════════════════════ */
interface Q9World {
  chambers: {
    c1: number[]; // 1, 5, 7
    c2: number[]; // 2, 4, 6
    c3: number[]; // 3, 8, 9
  };
}

export function B09ShapeSortingObservatoryActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q9World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: {
      chambers: {
        c1: [1, 5, 7],
        c2: [2, 4, 6],
        c3: [3, 8, 9],
      },
    },
    derive: (w) => {
      const isTarget =
        w.chambers.c1.length === 3 &&
        w.chambers.c2.length === 3 &&
        w.chambers.c3.length === 3;

      return {
        value: "Grouped: (1, 5, 7), (2, 4, 6), (3, 8, 9)",
        optionId: matchOption(question, "C") ?? "C",
        note: "3 geometric classes: (1, 5, 7) quadrant dividers; (2, 4, 6) vertical bisectors; (3, 8, 9) open diagonal lines.",
      };
    },
  });

  return (
    <PlayShell
      title="Shape Sorting Observatory"
      mission="Classify the 9 geometric figures into three distinct property chambers."
      icon={Grid}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Classified Sets" value="3/3 Chambers Configured" />}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Chamber 1 */}
          <div className="p-4 bg-indigo-50 border-2 border-indigo-300 rounded-2xl text-center shadow-xs">
            <span className="text-xs font-bold text-indigo-900">Chamber I (Quadrant Dividers)</span>
            <div className="flex justify-center gap-2 my-2 font-mono font-black text-indigo-700 text-lg">
              {world.chambers.c1.map((n) => (
                <span key={n} className="w-8 h-8 rounded-lg bg-white border border-indigo-200 flex items-center justify-center">
                  #{n}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Figs 1, 5, 7</span>
          </div>

          {/* Chamber 2 */}
          <div className="p-4 bg-purple-50 border-2 border-purple-300 rounded-2xl text-center shadow-xs">
            <span className="text-xs font-bold text-purple-900">Chamber II (Vertical Symmetries)</span>
            <div className="flex justify-center gap-2 my-2 font-mono font-black text-purple-700 text-lg">
              {world.chambers.c2.map((n) => (
                <span key={n} className="w-8 h-8 rounded-lg bg-white border border-purple-200 flex items-center justify-center">
                  #{n}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Figs 2, 4, 6</span>
          </div>

          {/* Chamber 3 */}
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center shadow-xs">
            <span className="text-xs font-bold text-emerald-900">Chamber III (Open Line Geometry)</span>
            <div className="flex justify-center gap-2 my-2 font-mono font-black text-emerald-700 text-lg">
              {world.chambers.c3.map((n) => (
                <span key={n} className="w-8 h-8 rounded-lg bg-white border border-emerald-200 flex items-center justify-center">
                  #{n}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Figs 3, 8, 9</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q10 — 🌴 Word Jungle (L J N U G E -> JUNGLE)
   Result: 2, 4, 3, 5, 1, 6 (Option A)
   ══════════════════════════════════════════════════════════════════════ */
interface Q10World {
  slots: number[]; // e.g. [2, 4, 3, 5, 1, 6]
}

export function B10WordJungleActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const LETTER_MAP: Record<number, string> = {
    1: "L",
    2: "J",
    3: "N",
    4: "U",
    5: "G",
    6: "E",
  };

  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q10World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { slots: [2, 4, 3, 5, 1, 6] },
    derive: (w) => {
      const word = w.slots.map((n) => LETTER_MAP[n] ?? "").join("");
      const seq = w.slots.join(", ");
      const isJungle = word === "JUNGLE";

      return {
        value: `${seq} (${word})`,
        optionId: isJungle ? matchOption(question, "A") ?? "A" : matchOption(question, "B") ?? "B",
        note: isJungle
          ? "Jungle gate unlocked: J(2), U(4), N(3), G(5), L(1), E(6) spells 'JUNGLE'."
          : `Current word: ${word}. Arrange stone pedestals to spell a meaningful English word.`,
      };
    },
  });

  const swap = (i: number, j: number) => {
    if (locked) return;
    set((w) => {
      const next = [...w.slots];
      const tmp = next[i];
      next[i] = next[j];
      next[j] = tmp;
      return { ...w, slots: next };
    });
  };

  return (
    <PlayShell
      title="Word Jungle"
      mission="Pick up and arrange the 6 3D letter stones onto the gate pedestals to form a meaningful word."
      icon={Sparkles}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Assembled Word" value={world.slots.map((n) => LETTER_MAP[n]).join("")} />}
    >
      <div className="space-y-4">
        {/* Stone Pedestals */}
        <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white p-6 rounded-2xl border border-emerald-500/30 shadow-xl text-center">
          <div className="text-xs font-mono font-bold text-emerald-300 mb-4">Jungle Temple Gate Pedestals</div>
          <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
            {world.slots.map((num, idx) => (
              <div
                key={idx}
                onClick={() => idx < world.slots.length - 1 && swap(idx, idx + 1)}
                className="w-14 h-20 bg-slate-950/80 border-2 border-emerald-400 rounded-xl flex flex-col items-center justify-between p-2 cursor-pointer hover:border-emerald-300 shadow-md"
              >
                <span className="text-[10px] font-mono text-emerald-400 font-bold">#{num}</span>
                <span className="text-2xl font-black text-amber-300 font-mono">{LETTER_MAP[num]}</span>
                <span className="text-[9px] text-slate-400">Pos {idx + 1}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-emerald-300/80 mt-3 font-medium">Click any stone to advance its position rightward.</p>
        </div>
      </div>
    </PlayShell>
  );
}

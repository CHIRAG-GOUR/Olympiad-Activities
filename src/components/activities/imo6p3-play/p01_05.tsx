"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RotateCw,
  Triangle,
  ArrowRight,
  Flame,
  Droplets,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q1 — 🧩 Pattern Conveyor
   ══════════════════════════════════════════════════════════════════════ */
interface Q1World {
  selectedShape: "diamond" | "hexagon" | "circle" | "square";
  rotationDeg: number;
  innerElement: "dot" | "star" | "cross" | "plus";
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
    initial: {
      selectedShape: "diamond",
      rotationDeg: 0,
      innerElement: "dot",
    },
    derive: (w) => {
      const isCorrectPattern =
        w.selectedShape === "diamond" &&
        w.rotationDeg === 180 &&
        w.innerElement === "cross";

      if (isCorrectPattern) {
        return {
          value: "Figure D (Diamond 180° with Cross)",
          optionId: matchText(question, "D") ?? "D",
        };
      }

      const desc = `${w.selectedShape.toUpperCase()} at ${w.rotationDeg}° with ${w.innerElement}`;
      return {
        value: desc,
        note: "Adjust shape, rotation, and inner symbol to complete the series.",
      };
    },
  });

  return (
    <PlayShell
      title="Pattern Conveyor"
      mission="Track symbol transformations along the conveyor and construct the 5th stage."
      icon={RotateCw}
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
          <Gauge label="Shape" value={world.selectedShape} />
          <Gauge label="Rotation" value={`${world.rotationDeg}°`} />
          <Gauge label="Inner Symbol" value={world.innerElement} />
        </>
      }
    >
      <div className="space-y-4">
        {/* Conveyor sequence */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-100 shadow-inner">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
            <span>Pattern Progression Conveyor</span>
            <span className="text-indigo-600">Stages 1–4 → Missing Stage 5</span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center">
            {/* Stage 1 */}
            <div className="bg-white/80 border border-indigo-200 p-2.5 rounded-lg flex flex-col items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Stage 1</span>
              <svg viewBox="0 0 60 60" className="w-12 h-12 my-2">
                <rect x="15" y="15" width="30" height="30" transform="rotate(45 30 30)" fill="#6366f1" />
                <circle cx="30" cy="30" r="3" fill="#facc15" />
              </svg>
              <span className="text-[9px] text-slate-600">0°</span>
            </div>

            {/* Stage 2 */}
            <div className="bg-white/80 border border-indigo-200 p-2.5 rounded-lg flex flex-col items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Stage 2</span>
              <svg viewBox="0 0 60 60" className="w-12 h-12 my-2">
                <rect x="15" y="15" width="30" height="30" fill="#3b82f6" />
                <polygon points="30,24 32,29 37,29 33,32 35,37 30,34 25,37 27,32 23,29 28,29" fill="#facc15" />
              </svg>
              <span className="text-[9px] text-slate-600">45°</span>
            </div>

            {/* Stage 3 */}
            <div className="bg-white/80 border border-indigo-200 p-2.5 rounded-lg flex flex-col items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Stage 3</span>
              <svg viewBox="0 0 60 60" className="w-12 h-12 my-2">
                <polygon points="30,12 46,21 46,39 30,48 14,39 14,21" fill="#ec4899" />
                <line x1="24" y1="24" x2="36" y2="36" stroke="#facc15" strokeWidth="2.5" />
                <line x1="36" y1="24" x2="24" y2="36" stroke="#facc15" strokeWidth="2.5" />
              </svg>
              <span className="text-[9px] text-slate-600">90°</span>
            </div>

            {/* Stage 4 */}
            <div className="bg-white/80 border border-indigo-200 p-2.5 rounded-lg flex flex-col items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Stage 4</span>
              <svg viewBox="0 0 60 60" className="w-12 h-12 my-2">
                <circle cx="30" cy="30" r="18" fill="#10b981" />
                <line x1="30" y1="23" x2="30" y2="37" stroke="#facc15" strokeWidth="2.5" />
                <line x1="23" y1="30" x2="37" y2="30" stroke="#facc15" strokeWidth="2.5" />
              </svg>
              <span className="text-[9px] text-slate-600">135°</span>
            </div>

            {/* Stage 5 Builder */}
            <div className="bg-indigo-100/60 border-2 border-indigo-400 p-2.5 rounded-lg flex flex-col items-center justify-between relative shadow-lg">
              <span className="text-[10px] text-amber-600 font-bold font-mono animate-pulse">Stage 5 ?</span>
              <svg viewBox="0 0 60 60" className="w-12 h-12 my-2">
                <g transform={`rotate(${world.rotationDeg} 30 30)`}>
                  {world.selectedShape === "diamond" && (
                    <rect x="15" y="15" width="30" height="30" transform="rotate(45 30 30)" fill="#6366f1" />
                  )}
                  {world.selectedShape === "square" && (
                    <rect x="15" y="15" width="30" height="30" fill="#3b82f6" />
                  )}
                  {world.selectedShape === "hexagon" && (
                    <polygon points="30,12 46,21 46,39 30,48 14,39 14,21" fill="#ec4899" />
                  )}
                  {world.selectedShape === "circle" && (
                    <circle cx="30" cy="30" r="18" fill="#10b981" />
                  )}

                  {world.innerElement === "dot" && <circle cx="30" cy="30" r="3.5" fill="#facc15" />}
                  {world.innerElement === "star" && (
                    <polygon points="30,24 32,29 37,29 33,32 35,37 30,34 25,37 27,32 23,29 28,29" fill="#facc15" />
                  )}
                  {world.innerElement === "cross" && (
                    <>
                      <line x1="24" y1="24" x2="36" y2="36" stroke="#facc15" strokeWidth="2.5" />
                      <line x1="36" y1="24" x2="24" y2="36" stroke="#facc15" strokeWidth="2.5" />
                    </>
                  )}
                  {world.innerElement === "plus" && (
                    <>
                      <line x1="30" y1="23" x2="30" y2="37" stroke="#facc15" strokeWidth="2.5" />
                      <line x1="23" y1="30" x2="37" y2="30" stroke="#facc15" strokeWidth="2.5" />
                    </>
                  )}
                </g>
              </svg>
              <span className="text-[9px] text-amber-600 font-bold">{world.rotationDeg}°</span>
            </div>
          </div>
        </div>

        {/* Builder controls */}
        <Bay label="Stage 5 Construction Controls">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1.5">Outer Shape</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(["diamond", "square", "hexagon", "circle"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set((w) => ({ ...w, selectedShape: s }))}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      world.selectedShape === s
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1.5">Rotation Step</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[0, 90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => set((w) => ({ ...w, rotationDeg: deg }))}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      world.rotationDeg === deg
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1.5">Inner Symbol</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(["dot", "star", "cross", "plus"] as const).map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => set((w) => ({ ...w, innerElement: sym }))}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      world.innerElement === sym
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
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
}

export function Q02TriangleScannerActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const TOTAL_TRIANGLES = 12;

  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q2World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { discovered: [] },
    derive: (w) => {
      const count = w.discovered.length;
      return {
        value: `${count} Triangles`,
        optionId: matchNumber(question, count),
        note:
          count === TOTAL_TRIANGLES
            ? "All geometric triangles identified!"
            : `Tap all triangular segments. Found ${count}/${TOTAL_TRIANGLES}.`,
      };
    },
  });

  const toggleTriangle = (idx: number) => {
    set((w) => {
      const exists = w.discovered.includes(idx);
      return {
        ...w,
        discovered: exists
          ? w.discovered.filter((i) => i !== idx)
          : [...w.discovered, idx],
      };
    });
  };

  const autoScanAll = () => {
    set({ discovered: Array.from({ length: TOTAL_TRIANGLES }, (_, i) => i) });
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
          <Gauge label="Found Triangles" value={`${world.discovered.length} / ${TOTAL_TRIANGLES}`} />
          <Gauge label="Scan Status" value={world.discovered.length === TOTAL_TRIANGLES ? "Complete" : "In Progress"} />
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 p-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          <div className="w-full max-w-sm aspect-square relative">
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.7" />
                </linearGradient>
              </defs>

              <rect x="50" y="50" width="200" height="200" fill="none" stroke="#64748b" strokeWidth="3" />
              <line x1="50" y1="50" x2="250" y2="250" stroke="#64748b" strokeWidth="2.5" />
              <line x1="250" y1="50" x2="50" y2="250" stroke="#64748b" strokeWidth="2.5" />
              <line x1="150" y1="50" x2="150" y2="250" stroke="#64748b" strokeWidth="2.5" />
              <line x1="50" y1="150" x2="250" y2="150" stroke="#64748b" strokeWidth="2.5" />
              <polygon points="150,50 250,150 150,250 50,150" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />

              {[
                { id: 0, pts: "50,50 150,50 150,150" },
                { id: 1, pts: "150,50 250,50 150,150" },
                { id: 2, pts: "250,50 250,150 150,150" },
                { id: 3, pts: "250,150 250,250 150,150" },
                { id: 4, pts: "250,250 150,250 150,150" },
                { id: 5, pts: "150,250 50,250 150,150" },
                { id: 6, pts: "50,250 50,150 150,150" },
                { id: 7, pts: "50,150 50,50 150,150" },
                { id: 8, pts: "50,50 250,50 150,150" },
                { id: 9, pts: "250,50 250,250 150,150" },
                { id: 10, pts: "250,250 50,250 150,150" },
                { id: 11, pts: "50,250 50,50 150,150" },
              ].map((t) => {
                const isSelected = world.discovered.includes(t.id);
                return (
                  <polygon
                    key={t.id}
                    points={t.pts}
                    onClick={() => toggleTriangle(t.id)}
                    className="cursor-pointer transition-all duration-200"
                    fill={isSelected ? "url(#triGrad)" : "transparent"}
                    stroke={isSelected ? "#a855f7" : "transparent"}
                    strokeWidth={isSelected ? "2" : "0"}
                    opacity={isSelected ? 0.75 : 0.15}
                  />
                );
              })}

              <circle cx="150" cy="150" r="4" fill="#facc15" />
            </svg>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Click/tap individual triangle sections on the board to scan them.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Btn onClick={autoScanAll} tone="slate">
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              Scan All Detected Boundaries ({TOTAL_TRIANGLES})
            </span>
          </Btn>
        </div>
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
}

export function Q03NumberFlipSortingActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const INITIAL_CARDS: CardItem[] = [
    { id: "c1", original: 254, isFlipped: false },
    { id: "c2", original: 439, isFlipped: false },
    { id: "c3", original: 671, isFlipped: false },
    { id: "c4", original: 894, isFlipped: false },
    { id: "c5", original: 958, isFlipped: false },
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
      sortedOrder: [0, 1, 2, 3, 4],
    },
    derive: (w) => {
      const allFlipped = w.cards.every((c) => c.isFlipped);
      const currentValues = w.sortedOrder.map((idx) => {
        const c = w.cards[idx];
        return c.isFlipped ? reverseNumber(c.original) : c.original;
      });

      const isAscending = currentValues.every(
        (v, i, arr) => i === 0 || v >= arr[i - 1]
      );

      if (allFlipped && isAscending) {
        const middleNum = currentValues[2]; // 498
        const middleDigit = Math.floor((middleNum % 100) / 10); // 9
        return {
          value: `${middleDigit} (from middle number ${middleNum})`,
          optionId: matchNumber(question, middleDigit) ?? "A",
        };
      }

      return {
        value: allFlipped ? "Reversed (Needs Sorting)" : "Unflipped Cards",
        note: "Flip all 5 numbers, sort ascending on the conveyor, and read the middle digit.",
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

  const flipAllAndSort = () => {
    const flipped = INITIAL_CARDS.map((c) => ({ ...c, isFlipped: true }));
    const vals = flipped.map((c, idx) => ({ idx, val: reverseNumber(c.original) }));
    vals.sort((a, b) => a.val - b.val);
    set({
      cards: flipped,
      sortedOrder: vals.map((v) => v.idx),
    });
  };

  const moveCard = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= 5) return;
    set((w) => {
      const next = [...w.sortedOrder];
      const item = next.splice(fromIndex, 1)[0];
      next.splice(toIndex, 0, item);
      return { ...w, sortedOrder: next };
    });
  };

  return (
    <PlayShell
      title="Number Flip Sorting Machine"
      mission="Flip the digits of each card, sort them into ascending order, and extract the middle digit."
      icon={RotateCw}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
    >
      <div className="space-y-4">
        <Bay label="Physical Reversal & Sorting Conveyor">
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
                  className={`p-2 sm:p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between ${
                    isMiddle
                      ? "bg-amber-50/80 border-amber-500 shadow-md scale-105"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    Slot {slotIdx + 1} {isMiddle && "⭐ Mid"}
                  </span>

                  <motion.div
                    className="my-2 cursor-pointer font-mono font-black text-lg sm:text-xl text-slate-800"
                    onClick={() => toggleFlip(cardIdx)}
                    animate={{ rotateY: card.isFlipped ? 360 : 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {displayedVal}
                  </motion.div>

                  <div className="w-full flex flex-col gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => toggleFlip(cardIdx)}
                      className={`text-[10px] font-bold py-1 px-1.5 rounded ${
                        card.isFlipped
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-indigo-100 text-indigo-800"
                      }`}
                    >
                      {card.isFlipped ? "Flipped ↩" : "Flip 180°"}
                    </button>

                    <div className="flex justify-between gap-1 mt-1">
                      <button
                        type="button"
                        disabled={slotIdx === 0}
                        onClick={() => moveCard(slotIdx, slotIdx - 1)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded px-1.5 py-0.5"
                      >
                        ◀
                      </button>
                      <button
                        type="button"
                        disabled={slotIdx === 4}
                        onClick={() => moveCard(slotIdx, slotIdx + 1)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded px-1.5 py-0.5"
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Bay>

        <div className="flex justify-end">
          <Btn onClick={flipAllAndSort} tone="slate">
            <span className="flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              Auto-Flip & Sort Ascending
            </span>
          </Btn>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q4 — 🔺 Number Triangle Reactor
   ══════════════════════════════════════════════════════════════════════ */
interface Q4World {
  calculatedValue: number | null;
  selectedOp: string;
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
    initial: {
      calculatedValue: null,
      selectedOp: "(Top × Left) + Right",
    },
    derive: (w) => {
      if (w.calculatedValue === 38) {
        return {
          value: "38",
          optionId: matchNumber(question, 38) ?? "B",
        };
      }
      return {
        value: w.calculatedValue !== null ? String(w.calculatedValue) : undefined,
        note: "Derive the mathematical rule from Triangles 1 & 2 and calculate Triangle 3.",
      };
    },
  });

  const activateReactor = () => {
    set({ calculatedValue: 38, selectedOp: "(Top × Left) + Right" });
  };

  return (
    <PlayShell
      title="Number Triangle Reactor"
      mission="Discover the arithmetic reactor rule connecting the outer numbers to the centre value."
      icon={Flame}
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
          <Gauge label="Active Formula" value={world.selectedOp} />
          <Gauge label="Triangle 3 Result" value={world.calculatedValue !== null ? String(world.calculatedValue) : "Pending"} />
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-3 rounded-xl border border-indigo-100 flex flex-col items-center">
            <span className="text-[10px] text-slate-500 font-mono">Triangle 1 (Known)</span>
            <svg viewBox="0 0 160 140" className="w-36 h-32 my-1">
              <polygon points="80,15 145,125 15,125" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="80" cy="85" r="20" fill="#0284c7" />
              <text x="80" y="91" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">18</text>
              <text x="80" y="14" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">3</text>
              <text x="12" y="132" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">4</text>
              <text x="148" y="132" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">6</text>
            </svg>
            <span className="text-[10px] text-slate-500 font-mono">3 × 4 + 6 = 18</span>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-3 rounded-xl border border-indigo-100 flex flex-col items-center">
            <span className="text-[10px] text-slate-500 font-mono">Triangle 2 (Known)</span>
            <svg viewBox="0 0 160 140" className="w-36 h-32 my-1">
              <polygon points="80,15 145,125 15,125" fill="#1e293b" stroke="#a855f7" strokeWidth="2.5" />
              <circle cx="80" cy="85" r="20" fill="#9333ea" />
              <text x="80" y="91" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">27</text>
              <text x="80" y="14" fill="#c084fc" fontSize="13" fontWeight="bold" textAnchor="middle">4</text>
              <text x="12" y="132" fill="#c084fc" fontSize="13" fontWeight="bold" textAnchor="middle">5</text>
              <text x="148" y="132" fill="#c084fc" fontSize="13" fontWeight="bold" textAnchor="middle">7</text>
            </svg>
            <span className="text-[10px] text-slate-500 font-mono">4 × 5 + 7 = 27</span>
          </div>

          <div className="bg-indigo-100 text-slate-800 p-3 rounded-xl border-2 border-indigo-400 flex flex-col items-center shadow-lg">
            <span className="text-[10px] text-amber-600 font-bold font-mono animate-pulse">Triangle 3 (Derive ?)</span>
            <svg viewBox="0 0 160 140" className="w-36 h-32 my-1">
              <polygon points="80,15 145,125 15,125" fill="#312e81" stroke="#facc15" strokeWidth="2.5" />
              <circle cx="80" cy="85" r="22" fill="#eab308" />
              <text x="80" y="92" fill="#1e1b4b" fontSize="18" fontWeight="black" textAnchor="middle">
                {world.calculatedValue !== null ? world.calculatedValue : "?"}
              </text>
              <text x="80" y="14" fill="#fde047" fontSize="13" fontWeight="bold" textAnchor="middle">5</text>
              <text x="12" y="132" fill="#fde047" fontSize="13" fontWeight="bold" textAnchor="middle">6</text>
              <text x="148" y="132" fill="#fde047" fontSize="13" fontWeight="bold" textAnchor="middle">8</text>
            </svg>
            <span className="text-[10px] text-amber-600 font-mono">5 × 6 + 8 = ?</span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Btn onClick={activateReactor} tone="violet" active>
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              Activate Reactor (Calculate 5 × 6 + 8 = 38)
            </span>
          </Btn>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q5 — 💧 Reflection Pool
   ══════════════════════════════════════════════════════════════════════ */
interface Q5World {
  waterlineOffset: number;
  selectedOption: string | null;
}

export function Q05WaterReflectionPoolActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const WORD = "DISC5874";

  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q5World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { waterlineOffset: 0, selectedOption: null },
    derive: (w) => {
      if (w.selectedOption === "C") {
        return {
          value: "Water Image C",
          optionId: matchText(question, "C") ?? "C",
        };
      }
      return {
        value: w.selectedOption ? `Option ${w.selectedOption}` : undefined,
        note: "Inspect the vertical water reflection and verify letter inversion.",
      };
    },
  });

  const inspectWaterline = () => {
    set({ waterlineOffset: 10, selectedOption: "C" });
  };

  return (
    <PlayShell
      title="Water Reflection Pool"
      mission="Inspect the mathematical water reflection across the horizontal waterline."
      icon={Droplets}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 p-6 rounded-xl text-center relative overflow-hidden shadow-inner">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Original Word Code
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-indigo-900 py-2">
            {WORD}
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-400 to-indigo-500 rounded-full shadow-lg" />
            <span className="absolute bg-blue-600 text-white font-mono text-[9px] uppercase px-2 py-0.5 rounded-full">
              Water Surface Level
            </span>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-cyan-600 mb-2">
            Calculated Water Reflection
          </div>
          <div
            className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-cyan-600 py-2 opacity-80"
            style={{ transform: "scaleY(-1)" }}
          >
            {WORD}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Btn onClick={inspectWaterline} tone="violet" active>
            <span className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5" />
              Lock Matching Water Image (Option C)
            </span>
          </Btn>
        </div>
      </div>
    </PlayShell>
  );
}

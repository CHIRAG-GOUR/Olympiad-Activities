"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Sliders,
  Play,
  RotateCcw,
  Zap,
  Compass,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q1 — 🧩 Pattern Conveyor (Bidirectional Transformation Simulation)
   ══════════════════════════════════════════════════════════════════════ */
interface Q1World {
  rotationDeg: number; // 0, 45, 90, 135, 180
  arrowDir: "North" | "NE" | "East" | "SE" | "South";
  innerShape: "Circle" | "Star" | "Cross" | "Square" | "Diamond";
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
    initial: {
      rotationDeg: 180,
      arrowDir: "South",
      innerShape: "Square",
      chosenOption: "D",
    },
    derive: (w) => {
      const desc = `Figure ${w.chosenOption} — Diamond 180°, South Arrow, Center Square`;
      return {
        value: desc,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: `Submitted configuration: Figure ${w.chosenOption}`,
      };
    },
  });

  const selectOption = (opt: "A" | "B" | "C" | "D") => {
    if (opt === "D") {
      set({ rotationDeg: 180, arrowDir: "South", innerShape: "Square", chosenOption: "D" });
    } else if (opt === "A") {
      set({ rotationDeg: 0, arrowDir: "North", innerShape: "Diamond", chosenOption: "A" });
    } else if (opt === "B") {
      set({ rotationDeg: 45, arrowDir: "NE", innerShape: "Circle", chosenOption: "B" });
    } else {
      set({ rotationDeg: 90, arrowDir: "East", innerShape: "Cross", chosenOption: "C" });
    }
  };

  const handleRotationChange = (deg: number) => {
    let opt: "A" | "B" | "C" | "D" = "D";
    let dir: "North" | "NE" | "East" | "SE" | "South" = "South";
    let shape: "Circle" | "Star" | "Cross" | "Square" | "Diamond" = "Square";

    if (deg === 0) {
      opt = "A";
      dir = "North";
      shape = "Diamond";
    } else if (deg === 45) {
      opt = "B";
      dir = "NE";
      shape = "Circle";
    } else if (deg === 90) {
      opt = "C";
      dir = "East";
      shape = "Cross";
    } else {
      opt = "D";
      dir = "South";
      shape = "Square";
    }

    set({
      rotationDeg: deg,
      arrowDir: dir,
      innerShape: shape,
      chosenOption: opt,
    });
  };

  return (
    <PlayShell
      title="Pattern Conveyor"
      mission="Track sequential rotations and symbols along the conveyor. Use the assembly controls or select a candidate figure to complete Stage 5."
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
          <Gauge label="Stage 5 Angle" value={`${world.rotationDeg}°`} />
          <Gauge label="Selected Figure" value={`Option ${world.chosenOption}`} />
        </>
      }
    >
      <div className="space-y-4">
        {/* Animated Conveyor Track */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 rounded-xl border border-indigo-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-indigo-700">
              <Zap className="w-4 h-4" /> Pattern Conveyor Track
            </span>
            <span className="text-slate-500 font-mono text-[11px]">45° CW Step Progression</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {/* Stage 1 */}
            <div className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col items-center justify-between shadow-xs">
              <span className="text-[10px] text-slate-500 font-mono font-bold">Stage 1</span>
              <svg viewBox="0 0 70 70" className="w-16 h-16 my-1.5">
                <rect x="20" y="20" width="30" height="30" transform="rotate(45 35 35)" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                <circle cx="35" cy="35" r="5" fill="#6366f1" />
                <line x1="35" y1="12" x2="35" y2="4" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="32,6 38,6 35,2" fill="#4f46e5" />
              </svg>
              <span className="text-[10px] text-slate-600 font-semibold">0° · North</span>
            </div>

            {/* Stage 2 */}
            <div className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col items-center justify-between shadow-xs">
              <span className="text-[10px] text-slate-500 font-mono font-bold">Stage 2</span>
              <svg viewBox="0 0 70 70" className="w-16 h-16 my-1.5">
                <rect x="20" y="20" width="30" height="30" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                <polygon points="35,26 38,32 44,32 39,36 41,42 35,38 29,42 31,36 26,32 32,32" fill="#3b82f6" />
                <line x1="50" y1="20" x2="57" y2="13" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="53,11 59,17 59,11" fill="#3b82f6" />
              </svg>
              <span className="text-[10px] text-slate-600 font-semibold">45° · North-East</span>
            </div>

            {/* Stage 3 */}
            <div className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col items-center justify-between shadow-xs">
              <span className="text-[10px] text-slate-500 font-mono font-bold">Stage 3</span>
              <svg viewBox="0 0 70 70" className="w-16 h-16 my-1.5">
                <rect x="20" y="20" width="30" height="30" transform="rotate(45 35 35)" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                <line x1="28" y1="28" x2="42" y2="42" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
                <line x1="42" y1="28" x2="28" y2="42" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
                <line x1="56" y1="35" x2="64" y2="35" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="62,32 62,38 66,35" fill="#ec4899" />
              </svg>
              <span className="text-[10px] text-slate-600 font-semibold">90° · East</span>
            </div>

            {/* Stage 4 */}
            <div className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col items-center justify-between shadow-xs">
              <span className="text-[10px] text-slate-500 font-mono font-bold">Stage 4</span>
              <svg viewBox="0 0 70 70" className="w-16 h-16 my-1.5">
                <rect x="20" y="20" width="30" height="30" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                <line x1="35" y1="26" x2="35" y2="44" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                <line x1="26" y1="35" x2="44" y2="35" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                <line x1="50" y1="50" x2="57" y2="57" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="53,59 59,53 59,59" fill="#10b981" />
              </svg>
              <span className="text-[10px] text-slate-600 font-semibold">135° · South-East</span>
            </div>

            {/* Stage 5 Interactive Assembly Bay */}
            <div className="bg-indigo-50/80 border-2 border-indigo-500 p-3 rounded-xl flex flex-col items-center justify-between col-span-2 sm:col-span-1 shadow-md ring-2 ring-indigo-200">
              <span className="text-[10px] text-indigo-700 font-black font-mono">
                Stage 5 (Option {world.chosenOption})
              </span>
              <motion.div
                key={world.rotationDeg}
                initial={{ scale: 0.8, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <svg viewBox="0 0 70 70" className="w-16 h-16 my-1.5 drop-shadow-sm">
                  {world.chosenOption === "D" && (
                    <>
                      <rect x="20" y="20" width="30" height="30" transform="rotate(45 35 35)" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.5" />
                      <rect x="30" y="30" width="10" height="10" fill="#4f46e5" />
                      <line x1="35" y1="56" x2="35" y2="64" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
                      <polygon points="32,62 38,62 35,66" fill="#4f46e5" />
                    </>
                  )}
                  {world.chosenOption === "A" && (
                    <>
                      <rect x="20" y="20" width="30" height="30" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                      <rect x="12" y="30" width="10" height="10" transform="rotate(45 17 35)" fill="#94a3b8" />
                      <line x1="35" y1="12" x2="35" y2="4" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
                    </>
                  )}
                  {world.chosenOption === "B" && (
                    <>
                      <circle cx="35" cy="35" r="16" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                      <circle cx="35" cy="35" r="6" fill="#6366f1" />
                      <line x1="48" y1="22" x2="56" y2="14" stroke="#6366f1" strokeWidth="2.5" />
                    </>
                  )}
                  {world.chosenOption === "C" && (
                    <>
                      <polygon points="35,55 18,22 52,22" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                      <line x1="50" y1="35" x2="60" y2="35" stroke="#6366f1" strokeWidth="2.5" />
                    </>
                  )}
                </svg>
              </motion.div>
              <span className="text-[10px] text-indigo-700 font-bold">{world.rotationDeg}° · {world.arrowDir}</span>
            </div>
          </div>

          {/* Interactive Rotation Dial Slider */}
          <div className="mt-4 pt-3 border-t border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-600 shrink-0">Stage 5 Rotation Dial:</span>
              <div className="flex gap-1.5 flex-wrap">
                {[0, 45, 90, 180].map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => handleRotationChange(deg)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                      world.rotationDeg === deg
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Candidate Option Cards */}
        <Bay label="Candidate Figures (Select A, B, C, or D)">
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
                title: "Option D",
                subtitle: "180° Diamond + South Arrow + Square",
                renderSvg: () => (
                  <svg viewBox="0 0 80 80" className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <rect x="20" y="20" width="40" height="40" transform="rotate(45 40 40)" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.5" />
                    <rect x="33" y="33" width="14" height="14" fill="#4f46e5" />
                    <line x1="40" y1="68" x2="40" y2="76" stroke="#4f46e5" strokeWidth="3" />
                  </svg>
                ),
              },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => selectOption(opt.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-xs text-slate-800">{opt.title}</span>
                    {isSelected && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        Selected
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

/* ══════════════════════════════════════════════════════════════════════
   Q2 — 🔺 18-Triangle Geometric Scanner & Segment Reactor
   ══════════════════════════════════════════════════════════════════════ */
interface Q2World {
  discovered: number[];
  filterLayer: "all" | "small" | "inner" | "diagonal" | "outer";
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
      discovered: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      filterLayer: "all",
      chosenOption: "A",
    },
    derive: (w) => {
      const count = w.chosenOption === "A" ? 18 : w.chosenOption === "B" ? 16 : w.chosenOption === "C" ? 20 : 14;
      return {
        value: `${count} Triangles`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, count) ?? w.chosenOption,
        note: `Submitted count: ${count} Triangles`,
      };
    },
  });

  const selectOption = (opt: "A" | "B" | "C" | "D") => {
    let count = 18;
    if (opt === "A") count = 18;
    else if (opt === "B") count = 16;
    else if (opt === "C") count = 20;
    else count = 14;

    set((prev) => ({
      ...prev,
      discovered: Array.from({ length: Math.min(18, count) }, (_, i) => i),
      chosenOption: opt,
    }));
  };

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

  const TRIANGLES = [
    // 8 Small
    { id: 0, cat: "small", pts: "40,40 150,150 40,150", name: "Small #1" },
    { id: 1, cat: "small", pts: "40,40 150,40 150,150", name: "Small #2" },
    { id: 2, cat: "small", pts: "150,40 260,40 150,150", name: "Small #3" },
    { id: 3, cat: "small", pts: "260,40 260,150 150,150", name: "Small #4" },
    { id: 4, cat: "small", pts: "260,150 260,260 150,150", name: "Small #5" },
    { id: 5, cat: "small", pts: "260,260 150,260 150,150", name: "Small #6" },
    { id: 6, cat: "small", pts: "150,260 40,260 150,150", name: "Small #7" },
    { id: 7, cat: "small", pts: "40,260 40,150 150,150", name: "Small #8" },
    // 4 Inner Quad
    { id: 8, cat: "inner", pts: "40,40 260,40 150,150", name: "Inner Top" },
    { id: 9, cat: "inner", pts: "260,40 260,260 150,150", name: "Inner Right" },
    { id: 10, cat: "inner", pts: "260,260 40,260 150,150", name: "Inner Bottom" },
    { id: 11, cat: "inner", pts: "40,260 40,40 150,150", name: "Inner Left" },
    // 4 Mid diagonals
    { id: 12, cat: "diagonal", pts: "40,40 260,40 40,260", name: "Mid Diagonal #1" },
    { id: 13, cat: "diagonal", pts: "260,40 260,260 40,40", name: "Mid Diagonal #2" },
    { id: 14, cat: "diagonal", pts: "260,260 40,260 260,40", name: "Mid Diagonal #3" },
    { id: 15, cat: "diagonal", pts: "40,260 40,40 260,260", name: "Mid Diagonal #4" },
    // 2 Outer main
    { id: 16, cat: "outer", pts: "40,40 260,260 40,260", name: "Large Half #1" },
    { id: 17, cat: "outer", pts: "260,40 40,260 260,260", name: "Large Half #2" },
  ];

  return (
    <PlayShell
      title="Triangle Scanner"
      mission="Identify all closed triangles formed inside the composite square grid. Click triangular sectors or select an option to inspect."
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
          <Gauge label="Selected Option" value={`Option ${world.chosenOption}`} />
        </>
      }
    >
      <div className="space-y-4">
        {/* Interactive Geometric Scanning Matrix */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-4 rounded-xl flex flex-col items-center justify-center relative shadow-sm">
          <div className="w-full max-w-xs aspect-square relative">
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="triGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Base Outer Geometry */}
              <rect x="40" y="40" width="220" height="220" fill="#f8fafc" stroke="#475569" strokeWidth="3" rx="2" />
              <line x1="40" y1="40" x2="260" y2="260" stroke="#475569" strokeWidth="2.5" />
              <line x1="260" y1="40" x2="40" y2="260" stroke="#475569" strokeWidth="2.5" />
              <line x1="150" y1="40" x2="150" y2="260" stroke="#475569" strokeWidth="2.5" />
              <line x1="40" y1="150" x2="260" y2="150" stroke="#475569" strokeWidth="2.5" />

              {/* Interactive Triangle Polygons */}
              {TRIANGLES.map((t) => {
                const isSelected = world.discovered.includes(t.id);
                return (
                  <polygon
                    key={t.id}
                    points={t.pts}
                    onClick={() => toggleTriangle(t.id)}
                    className="cursor-pointer transition-all duration-200 hover:opacity-90"
                    fill={isSelected ? "url(#triGradActive)" : "transparent"}
                    stroke={isSelected ? "#6366f1" : "transparent"}
                    strokeWidth={isSelected ? "2" : "0"}
                    opacity={isSelected ? 0.7 : 0.05}
                  />
                );
              })}
              <circle cx="150" cy="150" r="5" fill="#f59e0b" />
            </svg>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Click sectors to toggle triangle illumination, or select your final answer below:
          </p>
        </div>

        {/* 4 Option Cards */}
        <Bay label="Select Total Count of Triangles (Option A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, count: "18 Triangles", desc: "8 Small + 4 Inner + 4 Mid + 2 Outer" },
              { id: "B" as const, count: "16 Triangles", desc: "16 Triangle Combination" },
              { id: "C" as const, count: "20 Triangles", desc: "20 Triangle Combination" },
              { id: "D" as const, count: "14 Triangles", desc: "14 Triangle Combination" },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => selectOption(opt.id)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
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
   Q3 — 🔄 Number Flip Sorting Machine (3D Card Sorter Simulator)
   ══════════════════════════════════════════════════════════════════════ */
interface CardItem {
  id: string;
  original: number;
  isFlipped: boolean;
}

interface Q3World {
  cards: CardItem[];
  sortedOrder: number[];
  activeDigitIndex: number; // 0 (first), 1 (middle), 2 (last)
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
      activeDigitIndex: 1,
      chosenOption: "A",
    },
    derive: (w) => {
      const digit = w.chosenOption === "A" ? 9 : w.chosenOption === "B" ? 5 : w.chosenOption === "C" ? 3 : 7;
      return {
        value: `${digit} (Middle Digit)`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, digit) ?? w.chosenOption,
        note: `Submitted selection: ${digit}`,
      };
    },
  });

  const selectOption = (opt: "A" | "B" | "C" | "D") => {
    set((prev) => ({
      ...prev,
      chosenOption: opt,
    }));
  };

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
      mission="Flip the digits of each number, arrange them ascending, and identify the middle digit of the middle number."
      icon={RotateCw}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Selected Digit" value={world.chosenOption === "A" ? "9 (Option A)" : world.chosenOption === "B" ? "5 (Option B)" : world.chosenOption === "C" ? "3 (Option C)" : "7 (Option D)"} />}
    >
      <div className="space-y-4">
        {/* 3D Flip Card Sorter Track */}
        <Bay label="Sorted Reversed Number Track: 176, 452, 498, 859, 934">
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
                  onClick={() => toggleFlip(cardIdx)}
                  className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between ${
                    isMiddle
                      ? "bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-200"
                      : "bg-white border-slate-200 hover:border-slate-300"
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
        <Bay label="What is the Middle Digit of the Middle Number?">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, digit: "9", desc: "Digit 9" },
              { id: "B" as const, digit: "5", desc: "Digit 5" },
              { id: "C" as const, digit: "3", desc: "Digit 3" },
              { id: "D" as const, digit: "7", desc: "Digit 7" },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => selectOption(opt.id)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
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
   Q4 — 🔺 Number Triangle Reactor (Interactive Node Lab)
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
      const val = w.chosenOption === "A" ? 48 : w.chosenOption === "B" ? 54 : w.chosenOption === "C" ? 60 : 36;
      return {
        value: `${val}`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, val) ?? w.chosenOption,
        note: `Submitted selection: ${val}`,
      };
    },
  });

  return (
    <PlayShell
      title="Number Triangle Reactor"
      mission="Discover the arithmetic relationship connecting outer vertex numbers to the center."
      icon={Flame}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Derived Value" value={world.chosenOption === "B" ? "54 (Option B)" : world.chosenOption === "A" ? "48 (Option A)" : world.chosenOption === "C" ? "60 (Option C)" : "36 (Option D)"} />}
    >
      <div className="space-y-4">
        {/* 3 Interactive Number Triangles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Triangle 1 */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-3 rounded-xl border border-indigo-200 flex flex-col items-center shadow-xs">
            <span className="text-[10px] text-slate-500 font-mono font-bold">Triangle 1</span>
            <svg viewBox="0 0 160 140" className="w-36 h-32 my-1">
              <polygon points="80,20 145,120 15,120" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2.5" />
              <circle cx="80" cy="80" r="20" fill="#4f46e5" />
              <text x="80" y="86" fill="white" fontSize="15" fontWeight="black" textAnchor="middle">48</text>
              <text x="80" y="15" fill="#4338ca" fontSize="13" fontWeight="bold" textAnchor="middle">6</text>
              <text x="12" y="130" fill="#4338ca" fontSize="13" fontWeight="bold" textAnchor="middle">3</text>
              <text x="148" y="130" fill="#4338ca" fontSize="13" fontWeight="bold" textAnchor="middle">5</text>
            </svg>
          </div>

          {/* Triangle 2 */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-3 rounded-xl border border-indigo-200 flex flex-col items-center shadow-xs">
            <span className="text-[10px] text-slate-500 font-mono font-bold">Triangle 2</span>
            <svg viewBox="0 0 160 140" className="w-36 h-32 my-1">
              <polygon points="80,20 145,120 15,120" fill="#fce7f3" stroke="#ec4899" strokeWidth="2.5" />
              <circle cx="80" cy="80" r="20" fill="#db2777" />
              <text x="80" y="86" fill="white" fontSize="15" fontWeight="black" textAnchor="middle">50</text>
              <text x="80" y="15" fill="#be185d" fontSize="13" fontWeight="bold" textAnchor="middle">5</text>
              <text x="12" y="130" fill="#be185d" fontSize="13" fontWeight="bold" textAnchor="middle">4</text>
              <text x="148" y="130" fill="#be185d" fontSize="13" fontWeight="bold" textAnchor="middle">6</text>
            </svg>
          </div>

          {/* Triangle 3 */}
          <div className="bg-amber-50 text-slate-800 p-3 rounded-xl border-2 border-amber-400 flex flex-col items-center shadow-sm">
            <span className="text-[10px] text-amber-700 font-bold font-mono">Triangle 3</span>
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
          </div>
        </div>

        {/* 4 Candidate Option Cards */}
        <Bay label="Choose the Missing Number for Triangle 3 (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, val: 48 },
              { id: "B" as const, val: 54 },
              { id: "C" as const, val: 60 },
              { id: "D" as const, val: 36 },
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
                  <span className="text-2xl font-black text-slate-800 my-2">{opt.val}</span>
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
   Q5 — 💧 Hydrodynamic Water Reflection Pool
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
      const desc = `Figure ${w.chosenOption} — Water Reflection of ${WORD}`;
      return {
        value: desc,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: `Submitted selection: Option ${w.chosenOption}`,
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
        {/* Hydrodynamic Reflection Simulator */}
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
            Water Image Inversion (Live Mirror Rendering)
          </div>
          <motion.div
            key={world.chosenOption}
            initial={{ opacity: 0.5, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-blue-600 py-1 select-none"
          >
            {world.chosenOption === "C" ? "И ∩ C ⅂ E ∀ ᴚ ∂ 9" : world.chosenOption === "A" ? "И ∩ C Г E ∀ B ∂ e" : world.chosenOption === "B" ? "N U C L E A R 9 6" : "И U C ⅂ E A R 6 9"}
          </motion.div>
        </div>

        {/* 4 Candidate Option Cards */}
        <Bay label="Select the Correct Water Image Figure (A, B, C, or D)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "A" as const, text: "И ∩ C Г E ∀ B ∂ e", label: "Option A" },
              { id: "B" as const, text: "N U C L E A R 9 6", label: "Option B" },
              { id: "C" as const, text: "И ∩ C ⅂ E ∀ ᴚ ∂ 9", label: "Option C" },
              { id: "D" as const, text: "И U C ⅂ E A R 6 9", label: "Option D" },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
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
                      isSelected ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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

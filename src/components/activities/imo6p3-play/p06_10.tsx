"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  Layers,
  MapPin,
  Compass,
  Navigation,
  CheckCircle2,
  FolderSync,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q6 — 🔍 Shape X-Ray Scanner
   ══════════════════════════════════════════════════════════════════════ */
interface Q6World {
  activeCandidate: "A" | "B" | "C" | "D";
  scanMatched: boolean;
}

export function Q06ShapeXRayScannerActivity({
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
    initial: { activeCandidate: "A", scanMatched: true },
    derive: (w) => {
      if (w.activeCandidate === "A") {
        return {
          value: "Figure A (Exact Substructure Match)",
          optionId: matchText(question, "A") ?? "A",
        };
      }
      return {
        value: `Candidate ${w.activeCandidate} (Mismatch)`,
        note: "Figure X is not embedded in this candidate.",
      };
    },
  });

  return (
    <PlayShell
      title="Shape X-Ray Scanner"
      mission="Scan the four candidate figures with the X-Ray lens to find where Figure X is embedded."
      icon={Search}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Candidate Scanned" value={`Figure ${world.activeCandidate}`} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600/30 border border-indigo-400">
              <span className="text-xs font-mono font-bold text-indigo-600">Target Figure X</span>
            </div>
            <p className="text-xs text-slate-600">
              Find this connected geometric motif embedded inside one of the figures.
            </p>
          </div>
          <svg viewBox="0 0 80 80" className="w-16 h-16 bg-white/60 rounded-lg border border-indigo-200 p-1">
            <line x1="20" y1="20" x2="60" y2="20" stroke="#facc15" strokeWidth="3" />
            <line x1="20" y1="20" x2="40" y2="60" stroke="#facc15" strokeWidth="3" />
            <line x1="60" y1="20" x2="40" y2="60" stroke="#facc15" strokeWidth="3" />
            <line x1="40" y1="60" x2="40" y2="75" stroke="#facc15" strokeWidth="3" />
            <line x1="30" y1="75" x2="50" y2="75" stroke="#facc15" strokeWidth="3" />
          </svg>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["A", "B", "C", "D"] as const).map((cand) => {
            const isSelected = world.activeCandidate === cand;
            const isMatch = cand === "A";

            return (
              <div
                key={cand}
                onClick={() => set({ activeCandidate: cand, scanMatched: isMatch })}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-center flex flex-col items-center justify-between ${
                  isSelected
                    ? isMatch
                      ? "bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-200"
                      : "bg-slate-50 border-slate-400"
                    : "bg-white border-slate-200 hover:border-indigo-300"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="font-mono text-xs font-bold text-slate-600">Option {cand}</span>
                  {isSelected && isMatch && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      Match ✓
                    </span>
                  )}
                </div>

                <svg viewBox="0 0 80 80" className="w-20 h-20 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-lg p-1">
                  {cand === "A" && (
                    <>
                      <rect x="10" y="10" width="60" height="60" fill="none" stroke="#475569" strokeWidth="1.5" />
                      <line x1="20" y1="20" x2="60" y2="20" stroke="#facc15" strokeWidth="2.5" />
                      <line x1="20" y1="20" x2="40" y2="60" stroke="#facc15" strokeWidth="2.5" />
                      <line x1="60" y1="20" x2="40" y2="60" stroke="#facc15" strokeWidth="2.5" />
                      <line x1="40" y1="60" x2="40" y2="75" stroke="#facc15" strokeWidth="2.5" />
                      <line x1="30" y1="75" x2="50" y2="75" stroke="#facc15" strokeWidth="2.5" />
                    </>
                  )}
                  {cand === "B" && (
                    <>
                      <circle cx="40" cy="40" r="30" fill="none" stroke="#475569" strokeWidth="1.5" />
                      <line x1="20" y1="20" x2="60" y2="60" stroke="#64748b" strokeWidth="2" />
                      <line x1="60" y1="20" x2="20" y2="60" stroke="#64748b" strokeWidth="2" />
                    </>
                  )}
                  {cand === "C" && (
                    <>
                      <polygon points="40,10 70,70 10,70" fill="none" stroke="#475569" strokeWidth="1.5" />
                      <line x1="40" y1="10" x2="40" y2="70" stroke="#64748b" strokeWidth="2" />
                    </>
                  )}
                  {cand === "D" && (
                    <>
                      <rect x="15" y="15" width="50" height="50" fill="none" stroke="#475569" strokeWidth="1.5" />
                      <line x1="15" y1="40" x2="65" y2="40" stroke="#64748b" strokeWidth="2" />
                      <line x1="40" y1="15" x2="40" y2="65" stroke="#64748b" strokeWidth="2" />
                    </>
                  )}
                </svg>

                <button
                  type="button"
                  className="mt-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-full"
                >
                  {isSelected ? "Inspecting" : "Scan Candidate"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q7 — 🏷️ Word-Swap Laboratory
   ══════════════════════════════════════════════════════════════════════ */
interface Q7World {
  activeStepIndex: number;
}

export function Q07WordSwapLaboratoryActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const CHAIN = [
    { from: "Clock", to: "Television", use: "Time" },
    { from: "Television", to: "Radio", use: "Entertainment" },
    { from: "Radio", to: "Oven", use: "Audio" },
    { from: "Oven", to: "Grinder", use: "Baking" },
    { from: "Grinder", to: "Iron", use: "Crushing" },
  ];

  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q7World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { activeStepIndex: 3 },
    derive: (w) => {
      const step = CHAIN[w.activeStepIndex];
      const isCorrectBaking = step.from === "Oven" && step.to === "Grinder";

      if (isCorrectBaking) {
        return {
          value: "Grinder (Oven is called Grinder)",
          optionId: matchText(question, "A") ?? "A",
        };
      }

      return {
        value: step.to,
        note: `Baking is done in an Oven. Find what Oven is renamed to.`,
      };
    },
  });

  return (
    <PlayShell
      title="Word-Swap Laboratory"
      mission="Trace the semantic renaming chain to find what word represents the appliance used for baking."
      icon={FolderSync}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Selected Substitution" value={CHAIN[world.activeStepIndex]?.to} />}
    >
      <div className="space-y-4">
        <Bay label="Interactive Semantic Renaming Chain">
          <div className="flex flex-wrap items-center justify-center gap-2 py-3">
            {CHAIN.map((link, idx) => {
              const isSelected = world.activeStepIndex === idx;
              const isBaking = link.from === "Oven";

              return (
                <div key={link.from} className="flex items-center gap-2">
                  <div
                    onClick={() => set({ activeStepIndex: idx })}
                    className={`p-2.5 sm:p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center min-w-[100px] ${
                      isSelected
                        ? isBaking
                          ? "bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-200"
                          : "bg-indigo-50 border-indigo-500 shadow-md"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-500">
                      {link.use === "Baking" ? "🔥 Real Baking" : link.use}
                    </span>
                    <span className="font-bold text-xs text-slate-700">{link.from}</span>
                    <span className="text-[10px] text-indigo-600 font-black my-0.5">is called ↓</span>
                    <span className="font-black text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {link.to}
                    </span>
                  </div>

                  {idx < CHAIN.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
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
   Q8 — 🧱 Brick Wall Completion
   ══════════════════════════════════════════════════════════════════════ */
interface Q8World {
  placedPiece: "A" | "B" | "C" | "D";
}

export function Q08BrickWallCompletionActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q8World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { placedPiece: "B" },
    derive: (w) => {
      if (w.placedPiece === "B") {
        return {
          value: "Pattern Piece B (Exact Mortar Alignment)",
          optionId: matchText(question, "B") ?? "B",
        };
      }
      return {
        value: `Piece ${w.placedPiece}`,
        note: "Joints and lines must match the surrounding brickwork.",
      };
    },
  });

  return (
    <PlayShell
      title="Brick Wall Completion"
      mission="Fit the missing brickwork section into the wall to complete the structural pattern."
      icon={Layers}
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
        <div className="bg-amber-950/90 p-4 rounded-xl flex flex-col items-center shadow-inner">
          <svg viewBox="0 0 280 180" className="w-full max-w-sm h-44 bg-amber-900 rounded-lg border-2 border-amber-700">
            <line x1="0" y1="45" x2="280" y2="45" stroke="#78350f" strokeWidth="3" />
            <line x1="0" y1="90" x2="280" y2="90" stroke="#78350f" strokeWidth="3" />
            <line x1="0" y1="135" x2="280" y2="135" stroke="#78350f" strokeWidth="3" />

            <line x1="70" y1="0" x2="70" y2="45" stroke="#78350f" strokeWidth="3" />
            <line x1="210" y1="0" x2="210" y2="45" stroke="#78350f" strokeWidth="3" />
            <line x1="140" y1="45" x2="140" y2="90" stroke="#78350f" strokeWidth="3" />

            <rect x="140" y="90" width="140" height="90" fill="#451a03" stroke="#facc15" strokeWidth="2" strokeDasharray="5 5" />
            <text x="210" y="140" fill="#fde047" fontSize="13" fontWeight="bold" textAnchor="middle">
              Fit Piece {world.placedPiece}
            </text>
          </svg>
        </div>

        <Bay label="Candidate Brick Patterns">
          <div className="grid grid-cols-4 gap-2">
            {(["A", "B", "C", "D"] as const).map((piece) => (
              <button
                key={piece}
                type="button"
                onClick={() => set({ placedPiece: piece })}
                className={`p-2.5 rounded-xl border-2 font-bold text-xs transition-all ${
                  world.placedPiece === piece
                    ? "bg-amber-500 text-white border-amber-600 shadow-md"
                    : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                }`}
              >
                Piece {piece} {piece === "B" && "✓"}
              </button>
            ))}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q9 — 📄 Fold Studio
   ══════════════════════════════════════════════════════════════════════ */
interface Q9World {
  foldPercent: number;
}

export function Q09FoldStudioActivity({
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
    initial: { foldPercent: 100 },
    derive: (w) => {
      if (w.foldPercent >= 90) {
        return {
          value: "Folded Sheet D",
          optionId: matchText(question, "D") ?? "D",
        };
      }
      return {
        value: `Folded ${w.foldPercent}%`,
        note: "Complete the fold across the dotted line.",
      };
    },
  });

  return (
    <PlayShell
      title="Transparent Fold Studio"
      mission="Fold the transparent patterned sheet along the dotted crease to view the overlapping design."
      icon={Layers}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Fold Completion" value={`${world.foldPercent}%`} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 p-6 rounded-xl flex flex-col items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-48 h-48 bg-white/70 rounded-xl border border-indigo-200">
            <rect x="20" y="20" width="80" height="160" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
            <circle cx="60" cy="60" r="15" fill="#f43f5e" opacity="0.8" />
            <polygon points="60,110 80,150 40,150" fill="#10b981" opacity="0.8" />

            <line x1="100" y1="20" x2="100" y2="180" stroke="#facc15" strokeWidth="2.5" strokeDasharray="5 5" />

            {world.foldPercent > 0 && (
              <g opacity={world.foldPercent / 100}>
                <circle cx="60" cy="140" r="12" fill="#38bdf8" opacity="0.8" />
                <rect x="45" y="45" width="30" height="30" fill="#fbbf24" opacity="0.7" />
              </g>
            )}

            {world.foldPercent < 100 && (
              <g opacity={(100 - world.foldPercent) / 100}>
                <rect x="100" y="20" width="80" height="160" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
                <circle cx="140" cy="140" r="12" fill="#38bdf8" />
                <rect x="125" y="45" width="30" height="30" fill="#fbbf24" />
              </g>
            )}
          </svg>

          <input
            type="range"
            min="0"
            max="100"
            value={world.foldPercent}
            onChange={(e) => set({ foldPercent: Number(e.target.value) })}
            className="w-48 mt-4 accent-indigo-500 cursor-pointer"
          />
          <span className="text-[11px] text-slate-500 mt-1">Drag slider to fold right onto left</span>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q10 — 🗺️ Two-Explorer Navigation
   ══════════════════════════════════════════════════════════════════════ */
interface Q10World {
  calculatedDistance: number;
}

export function Q10TwoExplorerNavigationActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q10World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { calculatedDistance: 25 },
    derive: (w) => {
      return {
        value: `${w.calculatedDistance} m`,
        optionId: matchNumber(question, w.calculatedDistance) ?? "C",
      };
    },
  });

  return (
    <PlayShell
      title="Two-Explorer Navigation"
      mission="Trace the paths of Vansh and Puneet on the coordinate grid to find the distance between their starting points."
      icon={Navigation}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Start Distance" value={`${world.calculatedDistance} m`} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 p-4 rounded-xl flex flex-col items-center justify-center shadow-inner">
          <svg viewBox="0 0 300 200" className="w-full max-w-sm h-48 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-lg">
            {Array.from({ length: 15 }).map((_, i) => (
              <line key={`x-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="200" stroke="#334155" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`y-${i}`} x1="0" y1={i * 20} x2="300" y2={i * 20} stroke="#334155" strokeWidth="0.5" />
            ))}

            <circle cx="50" cy="150" r="5" fill="#38bdf8" />
            <text x="50" y="170" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              Vansh Start (A)
            </text>

            <circle cx="250" cy="150" r="5" fill="#f43f5e" />
            <text x="250" y="170" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">
              Puneet Start (B)
            </text>

            <circle cx="150" cy="50" r="6" fill="#facc15" />
            <text x="150" y="40" fill="#facc15" fontSize="12" fontWeight="black" textAnchor="middle">
              Meeting Point (C)
            </text>

            <polyline points="50,150 50,50 150,50" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 4" />
            <polyline points="250,150 250,50 150,50" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 4" />

            <line x1="50" y1="150" x2="250" y2="150" stroke="#a855f7" strokeWidth="3" />
            <text x="150" y="142" fill="#d8b4fe" fontSize="12" fontWeight="black" textAnchor="middle">
              Distance = 25 m
            </text>
          </svg>
        </div>
      </div>
    </PlayShell>
  );
}

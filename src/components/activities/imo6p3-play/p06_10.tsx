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
  Eye,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q6 — 🔍 Shape X-Ray Scanner (Embedded Figure)
   ══════════════════════════════════════════════════════════════════════ */
interface Q6World {
  activeCandidate: "A" | "B" | "C" | "D";
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
    initial: { activeCandidate: "A" },
    derive: (w) => {
      const isMatch = w.activeCandidate === "A";
      const desc = isMatch
        ? "Figure A (Exact Substructure Match)"
        : `Figure ${w.activeCandidate} (Non-matching structure)`;

      return {
        value: desc,
        optionId: matchOption(question, w.activeCandidate) ?? matchText(question, w.activeCandidate) ?? w.activeCandidate,
        note: isMatch
          ? "Target Figure (X) is embedded inside Option A!"
          : "Target Figure (X) is not embedded in this figure.",
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
      live={<Gauge label="Inspected Candidate" value={`Figure ${world.activeCandidate}`} />}
    >
      <div className="space-y-4">
        {/* Target Figure X Header */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-sm">
              Target Figure (X)
            </div>
            <p className="text-xs text-slate-600">
              Find this connected geometric anchor motif embedded inside one of the figures below:
            </p>
          </div>
          <svg viewBox="0 0 80 80" className="w-16 h-16 bg-white rounded-lg border-2 border-indigo-300 p-1 shadow-inner shrink-0">
            <line x1="20" y1="20" x2="60" y2="20" stroke="#6366f1" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="20" y1="20" x2="40" y2="55" stroke="#6366f1" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="60" y1="20" x2="40" y2="55" stroke="#6366f1" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="40" y1="55" x2="40" y2="72" stroke="#6366f1" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="26" y1="72" x2="54" y2="72" stroke="#6366f1" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* 4 Candidate Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["A", "B", "C", "D"] as const).map((cand) => {
            const isSelected = world.activeCandidate === cand;
            const isMatch = cand === "A";

            return (
              <div
                key={cand}
                onClick={() => set({ activeCandidate: cand })}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-center flex flex-col items-center justify-between ${
                  isSelected ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                    : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-700">Option {cand}</span>
                  {isSelected && (<span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">Selected</span>)}
                </div>

                <svg viewBox="0 0 90 90" className="w-24 h-24 bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200 rounded-lg p-1.5 my-1">
                  {cand === "A" && (
                    <>
                      <rect x="8" y="8" width="74" height="74" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="8" y1="45" x2="82" y2="45" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="22" y1="22" x2="68" y2="22" stroke={isSelected ? "#4f46e5" : "#64748b"} strokeWidth={isSelected ? "3.5" : "2"} strokeLinecap="round" />
                      <line x1="22" y1="22" x2="45" y2="58" stroke={isSelected ? "#4f46e5" : "#64748b"} strokeWidth={isSelected ? "3.5" : "2"} strokeLinecap="round" />
                      <line x1="68" y1="22" x2="45" y2="58" stroke={isSelected ? "#4f46e5" : "#64748b"} strokeWidth={isSelected ? "3.5" : "2"} strokeLinecap="round" />
                      <line x1="45" y1="58" x2="45" y2="76" stroke={isSelected ? "#4f46e5" : "#64748b"} strokeWidth={isSelected ? "3.5" : "2"} strokeLinecap="round" />
                      <line x1="30" y1="76" x2="60" y2="76" stroke={isSelected ? "#4f46e5" : "#64748b"} strokeWidth={isSelected ? "3.5" : "2"} strokeLinecap="round" />
                      <line x1="8" y1="8" x2="22" y2="22" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="82" y1="8" x2="68" y2="22" stroke="#94a3b8" strokeWidth="1.5" />
                    </>
                  )}
                  {cand === "B" && (
                    <>
                      <circle cx="45" cy="45" r="36" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="20" y1="20" x2="70" y2="70" stroke="#64748b" strokeWidth="2" />
                      <line x1="70" y1="20" x2="20" y2="70" stroke="#64748b" strokeWidth="2" />
                      <polygon points="45,15 75,70 15,70" fill="none" stroke="#64748b" strokeWidth="2" />
                    </>
                  )}
                  {cand === "C" && (
                    <>
                      <polygon points="45,10 80,75 10,75" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="45" y1="10" x2="45" y2="75" stroke="#64748b" strokeWidth="2" />
                      <line x1="25" y1="45" x2="65" y2="45" stroke="#64748b" strokeWidth="2" />
                      <circle cx="45" cy="50" r="14" fill="none" stroke="#64748b" strokeWidth="1.5" />
                    </>
                  )}
                  {cand === "D" && (
                    <>
                      <rect x="15" y="15" width="60" height="60" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="15" y1="45" x2="75" y2="45" stroke="#64748b" strokeWidth="2" />
                      <line x1="45" y1="15" x2="45" y2="75" stroke="#64748b" strokeWidth="2" />
                      <polygon points="45,20 70,45 45,70 20,45" fill="none" stroke="#64748b" strokeWidth="1.5" />
                    </>
                  )}
                </svg>

                <button
                  type="button"
                  className={`mt-2 text-[10px] font-bold px-2 py-1 rounded w-full transition-colors ${
                    isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {isSelected ? "Selected" : "Choose " + cand}
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
  activeChoice: "Grinder" | "Iron" | "Radio" | "Clock";
}

export function Q07WordSwapLaboratoryActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const CHAIN = [
    { from: "Clock", to: "Television", realJob: "Telling Time" },
    { from: "Television", to: "Radio", realJob: "Video Broadcast" },
    { from: "Radio", to: "Oven", realJob: "Audio Broadcast" },
    { from: "Oven", to: "Grinder", realJob: "Heating Appliance" },
    { from: "Grinder", to: "Iron", realJob: "Grinding Spices" },
  ];

  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q7World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { activeChoice: "Grinder" },
    derive: (w) => {
      const isCorrect = w.activeChoice === "Grinder";
      return {
        value: w.activeChoice,
        optionId:
          w.activeChoice === "Grinder"
            ? matchOption(question, "A") ?? "A"
            : w.activeChoice === "Iron"
            ? matchOption(question, "B") ?? "B"
            : w.activeChoice === "Radio"
            ? matchOption(question, "C") ?? "C"
            : matchOption(question, "D") ?? "D",
        note: isCorrect
          ? "A woman bakes a cake in an Oven, and Oven is called Grinder!"
          : `A cake is baked in an Oven. Find what Oven is renamed to in the chain.`,
      };
    },
  });

  return (
    <PlayShell
      title="Word-Swap Laboratory"
      mission="Trace the semantic renaming chain to find what word represents the appliance used for baking a cake."
      icon={FolderSync}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Selected Answer" value={world.activeChoice} />}
    >
      <div className="space-y-4">
        {/* Visual Substitution Chain */}
        <Bay label="Semantic Substitution Chain">
          <div className="flex flex-wrap items-center justify-center gap-2 py-3">
            {CHAIN.map((link, idx) => {
              const isChosen = world.activeChoice === link.to;

              return (
                <div key={link.from} className="flex items-center gap-1.5">
                  <div
                    onClick={() => {
                      if (["Grinder", "Iron", "Radio", "Clock"].includes(link.to)) {
                        set({ activeChoice: link.to as any });
                      }
                    }}
                    className={`p-2.5 sm:p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center min-w-[96px] ${
                      isChosen
                        ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      {link.realJob}
                    </span>
                    <span className="font-bold text-xs text-slate-800">{link.from}</span>
                    <span className="text-[10px] text-indigo-600 font-black my-0.5">is called ↓</span>
                    <span className="font-black text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {link.to}
                    </span>
                  </div>

                  {idx < CHAIN.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </Bay>

        {/* 4 Option Buttons */}
        <Bay label="Choose the Appliance for Baking a Cake">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "A", name: "Grinder" },
              { id: "B", name: "Iron" },
              { id: "C", name: "Radio" },
              { id: "D", name: "Clock" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => set({ activeChoice: opt.name as any })}
                className={`p-3 rounded-xl border-2 font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                  world.activeChoice === opt.name
                    ? "bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-200"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className="text-[11px] opacity-80">Option {opt.id}</span>
                <span className="text-sm font-black">{opt.name}</span>
              </button>
            ))}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q8 — 🧱 Brick Wall Completion (Rich Textured Pattern Completion)
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
      const isCorrect = w.placedPiece === "B";
      const desc = `Piece ${w.placedPiece} — ${
        w.placedPiece === "B"
          ? "Matched Horizontal Mortar Joints with Staggered Header Bond"
          : w.placedPiece === "A"
          ? "Vertical Offset Joints"
          : w.placedPiece === "C"
          ? "Diagonal Joints"
          : "Solid Unbonded Block"
      }`;

      return {
        value: desc,
        optionId: matchOption(question, w.placedPiece) ?? matchText(question, w.placedPiece) ?? w.placedPiece,
        note: isCorrect
          ? "Correct! Piece B perfectly restores the structural brick bond and mortar lines."
          : "Mortar joints and brick lines do not align with the surrounding wall.",
      };
    },
  });

  return (
    <PlayShell
      title="Brick Wall Completion"
      mission="Select the missing brickwork section that completes the masonry pattern in Figure (X)."
      icon={Layers}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Placed Piece" value={`Piece ${world.placedPiece}`} />}
    >
      <div className="space-y-4">
        {/* Wall Diagram Canvas */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 rounded-xl border border-amber-200 flex flex-col items-center shadow-sm">
          <div className="w-full max-w-md relative">
            <svg viewBox="0 0 320 200" className="w-full h-auto bg-gradient-to-b from-[#b45309] to-[#92400e] rounded-xl border-4 border-[#78350f] shadow-md">
              <defs>
                <linearGradient id="brickGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="50%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                <linearGradient id="pieceBGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>

              {/* Row 1 */}
              <rect x="5" y="5" width="70" height="42" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
              <rect x="80" y="5" width="75" height="42" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
              <rect x="160" y="5" width="75" height="42" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
              <rect x="240" y="5" width="75" height="42" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />

              {/* Row 2 */}
              <rect x="5" y="52" width="110" height="42" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
              <rect x="120" y="52" width="80" height="42" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
              <rect x="205" y="52" width="110" height="42" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />

              {/* Row 3 - Left section fixed */}
              <rect x="5" y="99" width="75" height="42" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
              <rect x="85" y="99" width="70" height="42" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />

              {/* Row 4 - Left section fixed */}
              <rect x="5" y="146" width="115" height="48" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
              <rect x="125" y="146" width="30" height="48" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />

              {/* Missing Quadrant Slot (Bottom Right: x=160, y=99, w=155, h=95) */}
              <g transform="translate(160, 99)">
                <rect x="0" y="0" width="155" height="95" fill="#451a03" stroke="#facc15" strokeWidth="2.5" strokeDasharray="5 5" rx="3" />

                {world.placedPiece === "A" && (
                  <g>
                    <rect x="3" y="3" width="70" height="42" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2" />
                    <rect x="78" y="3" width="74" height="42" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2" />
                    <rect x="3" y="48" width="70" height="44" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2" />
                    <rect x="78" y="48" width="74" height="44" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2" />
                  </g>
                )}

                {world.placedPiece === "B" && (
                  <g>
                    <rect x="3" y="3" width="74" height="42" fill="url(#pieceBGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
                    <rect x="82" y="3" width="70" height="42" fill="url(#pieceBGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
                    <rect x="3" y="48" width="35" height="44" fill="url(#pieceBGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
                    <rect x="43" y="48" width="74" height="44" fill="url(#pieceBGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
                    <rect x="122" y="48" width="30" height="44" fill="url(#pieceBGrad)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
                  </g>
                )}

                {world.placedPiece === "C" && (
                  <g>
                    <rect x="3" y="3" width="149" height="89" fill="#78350f" stroke="#fde68a" strokeWidth="2" />
                    <line x1="10" y1="10" x2="140" y2="80" stroke="#fde68a" strokeWidth="3" />
                    <line x1="40" y1="10" x2="140" y2="60" stroke="#fde68a" strokeWidth="3" />
                    <line x1="10" y1="30" x2="110" y2="80" stroke="#fde68a" strokeWidth="3" />
                  </g>
                )}

                {world.placedPiece === "D" && (
                  <g>
                    <rect x="3" y="3" width="149" height="89" fill="url(#brickGrad)" stroke="#fde68a" strokeWidth="2" rx="2" />
                    <text x="77" y="50" fill="#fef3c7" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Solid Block (No Mortar)
                    </text>
                  </g>
                )}

                <rect x="30" y="30" width="95" height="26" rx="6" fill="#1e1b4b" opacity="0.85" />
                <text x="77" y="47" fill="#fbbf24" fontSize="12" fontWeight="black" textAnchor="middle">
                  Fitted Piece {world.placedPiece}
                </text>
              </g>
            </svg>
          </div>
          <p className="text-xs text-amber-800 font-medium mt-2">
            Click any candidate brick piece below to test if it restores the staggered masonry bond:
          </p>
        </div>

        {/* 4 Candidate Brick Option Cards */}
        <Bay label="Candidate Brick Patterns (Select A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                id: "A" as const,
                title: "Option A",
                subtitle: "Aligned Grid Joints",
                renderSvg: () => (
                  <svg viewBox="0 0 100 65" className="w-full h-16 bg-[#b45309] rounded-lg border border-amber-300 p-1 shadow-inner">
                    <rect x="2" y="2" width="46" height="28" fill="#d97706" stroke="#fde68a" strokeWidth="1.5" />
                    <rect x="52" y="2" width="46" height="28" fill="#d97706" stroke="#fde68a" strokeWidth="1.5" />
                    <rect x="2" y="33" width="46" height="30" fill="#d97706" stroke="#fde68a" strokeWidth="1.5" />
                    <rect x="52" y="33" width="46" height="30" fill="#d97706" stroke="#fde68a" strokeWidth="1.5" />
                  </svg>
                ),
              },
              {
                id: "B" as const,
                title: "Option B",
                subtitle: "Staggered Running Bond",
                renderSvg: () => (
                  <svg viewBox="0 0 100 65" className="w-full h-16 bg-[#b45309] rounded-lg border border-slate-200 p-1 shadow-inner">
                    <rect x="2" y="2" width="48" height="28" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
                    <rect x="54" y="2" width="44" height="28" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
                    <rect x="2" y="33" width="22" height="30" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
                    <rect x="28" y="33" width="48" height="30" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
                    <rect x="80" y="33" width="18" height="30" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
                  </svg>
                ),
              },
              {
                id: "C" as const,
                title: "Option C",
                subtitle: "Diagonal Hatching",
                renderSvg: () => (
                  <svg viewBox="0 0 100 65" className="w-full h-16 bg-[#78350f] rounded-lg border border-amber-300 p-1 shadow-inner">
                    <line x1="5" y1="5" x2="95" y2="60" stroke="#fde68a" strokeWidth="2.5" />
                    <line x1="30" y1="5" x2="95" y2="45" stroke="#fde68a" strokeWidth="2.5" />
                    <line x1="5" y1="25" x2="70" y2="60" stroke="#fde68a" strokeWidth="2.5" />
                  </svg>
                ),
              },
              {
                id: "D" as const,
                title: "Option D",
                subtitle: "Solid Unbonded Slab",
                renderSvg: () => (
                  <svg viewBox="0 0 100 65" className="w-full h-16 bg-[#92400e] rounded-lg border border-amber-300 p-1 shadow-inner">
                    <rect x="4" y="4" width="92" height="57" fill="#b45309" stroke="#fde68a" strokeWidth="1.5" />
                  </svg>
                ),
              },
            ].map((opt) => {
              const isSelected = world.placedPiece === opt.id;
              const isB = opt.id === "B";

              return (
                <div
                  key={opt.id}
                  onClick={() => set({ placedPiece: opt.id })}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center ${
                    isSelected ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-amber-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <span className="font-bold text-xs text-slate-800">{opt.title}</span>
                    {isSelected && (<span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">Selected</span>)}
                  </div>

                  {opt.renderSvg()}

                  <span className="text-[10px] text-slate-500 font-medium mt-1.5">{opt.subtitle}</span>
                  <button
                    type="button"
                    className={`mt-2 text-[10px] font-bold px-2 py-1 rounded w-full transition-colors ${
                      isSelected ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected ? "Fitted in Wall" : "Fit Piece " + opt.id}
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
   Q9 — 📄 Transparent Fold Studio
   ══════════════════════════════════════════════════════════════════════ */
interface Q9World {
  foldPercent: number;
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { foldPercent: 100, chosenOption: "D" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "D";
      const desc = `Folded Sheet ${w.chosenOption} — Superimposed corner triangle with dual circle overlap`;

      return {
        value: desc,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! When folded along the dotted vertical crease, the right shapes superimpose directly over the left shapes."
          : `Inspect the overlap of shapes on Option ${w.chosenOption}.`,
      };
    },
  });

  return (
    <PlayShell
      title="Transparent Fold Studio"
      mission="Fold the transparent patterned sheet along the dotted crease and select the matching superimposed figure."
      icon={Layers}
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
          <Gauge label="Fold Crease Progress" value={`${world.foldPercent}%`} />
          <Gauge label="Selected Figure" value={`Option ${world.chosenOption}`} />
        </>
      }
    >
      <div className="space-y-4">
        {/* Interactive Folding Simulation Canvas */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-xl flex flex-col items-center justify-center shadow-sm">
          <div className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
            <span>Original Unfolded Sheet with Crease</span>
            <span className="text-indigo-600 font-mono">(Fold Right onto Left)</span>
          </div>

          <svg viewBox="0 0 240 180" className="w-64 h-48 bg-white/90 rounded-xl border-2 border-indigo-300 shadow-md">
            <rect x="20" y="20" width="100" height="140" fill="#e0e7ff" fillOpacity="0.4" stroke="#6366f1" strokeWidth="2" rx="2" />
            <rect x="50" y="40" width="35" height="35" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
            <polygon points="67,95 90,140 45,140" fill="#10b981" stroke="#059669" strokeWidth="1.5" />

            <line x1="120" y1="15" x2="120" y2="165" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5 4" />

            {world.foldPercent < 100 && (
              <g opacity={(100 - world.foldPercent) / 100}>
                <rect x="120" y="20" width="100" height="140" fill="#e0e7ff" fillOpacity="0.4" stroke="#6366f1" strokeWidth="2" rx="2" />
                <circle cx="170" cy="57" r="16" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
                <polygon points="170,140 190,95 150,95" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
              </g>
            )}

            {world.foldPercent > 0 && (
              <g opacity={world.foldPercent / 100}>
                <circle cx="67" cy="57" r="16" fill="#3b82f6" fillOpacity="0.65" stroke="#1d4ed8" strokeWidth="2" />
                <polygon points="67,140 47,95 87,95" fill="#ec4899" fillOpacity="0.65" stroke="#be185d" strokeWidth="2" />
              </g>
            )}
          </svg>

          {/* Slider and Quick Action Buttons */}
          <div className="w-full max-w-xs mt-4 flex flex-col items-center gap-2">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-600">
              <span>Unfolded (0%)</span>
              <span className="text-indigo-600">{world.foldPercent}% Folded</span>
              <span>Fully Folded (100%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={world.foldPercent}
              onChange={(e) => set((prev) => ({ ...prev, foldPercent: Number(e.target.value) }))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => set((prev) => ({ ...prev, foldPercent: 0 }))}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
              >
                Unfold (0%)
              </button>
              <button
                type="button"
                onClick={() => set((prev) => ({ ...prev, foldPercent: 100, chosenOption: "D" }))}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Fold Complete (100%)
              </button>
            </div>
          </div>
        </div>

        {/* 4 Folded Option Cards */}
        <Bay label="Candidate Result Figures (Select matching Option A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                id: "A" as const,
                title: "Option A",
                subtitle: "Triangle Left Overlap",
                renderSvg: () => (
                  <svg viewBox="0 0 100 100" className="w-20 h-20 bg-slate-50 rounded-lg border border-slate-200 p-1">
                    <rect x="20" y="10" width="60" height="80" fill="#e0e7ff" fillOpacity="0.4" stroke="#6366f1" strokeWidth="1.5" />
                    <polygon points="50,20 75,50 25,50" fill="#10b981" />
                    <circle cx="50" cy="70" r="12" fill="#3b82f6" />
                  </svg>
                ),
              },
              {
                id: "B" as const,
                title: "Option B",
                subtitle: "Double Inverted Square",
                renderSvg: () => (
                  <svg viewBox="0 0 100 100" className="w-20 h-20 bg-slate-50 rounded-lg border border-slate-200 p-1">
                    <rect x="20" y="10" width="60" height="80" fill="#e0e7ff" fillOpacity="0.4" stroke="#6366f1" strokeWidth="1.5" />
                    <rect x="35" y="20" width="30" height="30" fill="#f59e0b" />
                    <rect x="40" y="55" width="20" height="20" fill="#3b82f6" />
                  </svg>
                ),
              },
              {
                id: "C" as const,
                title: "Option C",
                subtitle: "Symmetric Cross",
                renderSvg: () => (
                  <svg viewBox="0 0 100 100" className="w-20 h-20 bg-slate-50 rounded-lg border border-slate-200 p-1">
                    <rect x="20" y="10" width="60" height="80" fill="#e0e7ff" fillOpacity="0.4" stroke="#6366f1" strokeWidth="1.5" />
                    <line x1="30" y1="30" x2="70" y2="70" stroke="#ec4899" strokeWidth="3" />
                    <line x1="70" y1="30" x2="30" y2="70" stroke="#ec4899" strokeWidth="3" />
                  </svg>
                ),
              },
              {
                id: "D" as const,
                title: "Option D",
                subtitle: "Square + Inscribed Circle & Star Triangles",
                renderSvg: () => (
                  <svg viewBox="0 0 100 100" className="w-20 h-20 bg-indigo-50/60 rounded-lg border border-slate-200 p-1">
                    <rect x="20" y="10" width="60" height="80" fill="#e0e7ff" fillOpacity="0.4" stroke="#6366f1" strokeWidth="1.5" />
                    <rect x="35" y="20" width="30" height="30" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
                    <circle cx="50" cy="35" r="12" fill="#3b82f6" fillOpacity="0.7" stroke="#1d4ed8" strokeWidth="1.5" />
                    <polygon points="50,55 68,85 32,85" fill="#10b981" stroke="#059669" strokeWidth="1" />
                    <polygon points="50,85 32,55 68,55" fill="#ec4899" fillOpacity="0.7" stroke="#be185d" strokeWidth="1" />
                  </svg>
                ),
              },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              const isD = opt.id === "D";

              return (
                <div
                  key={opt.id}
                  onClick={() => set((prev) => ({ ...prev, chosenOption: opt.id }))}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center ${
                    isSelected ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm"
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

/* ══════════════════════════════════════════════════════════════════════
   Q10 — 🗺️ Two-Explorer Navigation
   ══════════════════════════════════════════════════════════════════════ */
interface Q10World {
  chosenOption: "A" | "B" | "C" | "D";
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
    initial: { chosenOption: "C" },
    derive: (w) => {
      const isCorrect = w.chosenOption === "C";
      const dist = w.chosenOption === "A" ? 25 : w.chosenOption === "B" ? 30 : w.chosenOption === "C" ? 35 : 40;
      return {
        value: `${dist} metres`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, dist) ?? w.chosenOption,
        note: isCorrect
          ? "Correct! Distance between Vansh (0,0) and Puneet (15,-30) coordinates equals 35 metres along vector path."
          : `Selected ${dist} metres. Track both explorers' turns to determine starting positions.`,
      };
    },
  });

  return (
    <PlayShell
      title="Two-Explorer Navigation"
      mission="Trace the coordinate paths of Vansh and Puneet to calculate the distance between their starting points."
      icon={Navigation}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Start Distance" value={world.chosenOption === "C" ? "35 metres (Option C)" : world.chosenOption === "A" ? "25 metres (Option A)" : world.chosenOption === "B" ? "30 metres (Option B)" : "40 metres (Option D)"} />}
    >
      <div className="space-y-4">
        {/* Navigation Grid Canvas */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-4 rounded-xl flex flex-col items-center justify-center shadow-sm">
          <svg viewBox="0 0 320 200" className="w-full max-w-md h-48 bg-white border border-slate-300 rounded-lg shadow-inner">
            {/* Grid lines */}
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`x-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="200" stroke="#f1f5f9" strokeWidth="1" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`y-${i}`} x1="0" y1={i * 20} x2="320" y2={i * 20} stroke="#f1f5f9" strokeWidth="1" />
            ))}

            {/* Vansh Path: Start (40, 60) -> North 20m -> East 30m -> South 35m -> Point C (160, 140) */}
            <circle cx="40" cy="60" r="6" fill="#3b82f6" />
            <text x="40" y="50" fill="#1d4ed8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Vansh Start
            </text>

            {/* Puneet Start (100, 180) -> East 15m -> North 15m -> Point C (160, 140) */}
            <circle cx="100" cy="170" r="6" fill="#ec4899" />
            <text x="100" y="190" fill="#be185d" fontSize="10" fontWeight="bold" textAnchor="middle">
              Puneet Start
            </text>

            {/* Meeting Point C */}
            <circle cx="160" cy="140" r="7" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
            <text x="160" y="130" fill="#92400e" fontSize="10" fontWeight="black" textAnchor="middle">
              Point C
            </text>

            {/* Paths */}
            <polyline points="40,60 40,20 160,20 160,140" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 3" />
            <polyline points="100,170 160,170 160,140" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="4 3" />

            {/* Distance line between Start Points */}
            <line x1="40" y1="60" x2="100" y2="170" stroke="#8b5cf6" strokeWidth="3" />
            <rect x="50" y="105" width="60" height="20" rx="4" fill="#7c3aed" />
            <text x="80" y="119" fill="#ffffff" fontSize="10" fontWeight="black" textAnchor="middle">
              35 m
            </text>
          </svg>
        </div>

        {/* 4 Option Buttons */}
        <Bay label="Select Shortest Distance Between Starting Points">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "A" as const, dist: "25 metres", },
              { id: "B" as const, dist: "30 metres", },
              { id: "C" as const, dist: "35 metres", },
              { id: "D" as const, dist: "40 metres", },
            ].map((opt) => {
              const isSelected = world.chosenOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => set({ chosenOption: opt.id })}
                  className={`p-3 rounded-xl border-2 font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-200"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[11px] opacity-80">Option {opt.id}</span>
                  <span className="text-sm font-black">{opt.dist}</span>
                </button>
              );
            })}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

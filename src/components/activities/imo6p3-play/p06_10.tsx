"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Layers,
  MapPin,
  FolderSync,
  Building2,
  Navigation,
  Eye,
  Crosshair,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q6 — ⚓ Embedded Figure UV X-Ray Scanner
   ══════════════════════════════════════════════════════════════════════ */
interface Q6World {
  scannerX: number;
  scannerY: number;
  uvIntensity: number; // 0..100
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
    initial: {
      scannerX: 130,
      scannerY: 120,
      uvIntensity: 85,
      activeCandidate: "A",
    },
    derive: (w) => {
      const desc = `Candidate Figure ${w.activeCandidate}`;
      return {
        value: desc,
        optionId: matchOption(question, w.activeCandidate) ?? matchText(question, w.activeCandidate) ?? w.activeCandidate,
        note: `Submitted selection: Figure ${w.activeCandidate}`,
      };
    },
  });

  const selectCandidate = (cand: "A" | "B" | "C" | "D") => {
    let x = 130;
    let y = 120;
    if (cand === "B") {
      x = 70;
      y = 70;
    } else if (cand === "C") {
      x = 190;
      y = 70;
    } else if (cand === "D") {
      x = 130;
      y = 170;
    }

    set((prev) => ({
      ...prev,
      scannerX: x,
      scannerY: y,
      activeCandidate: cand,
    }));
  };

  return (
    <PlayShell
      title="Embedded Figure Scanner"
      mission="Identify which candidate figure is embedded as an exact sub-structure inside the main geometric matrix Figure (X)."
      icon={Crosshair}
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
          <Gauge label="UV Scanner Focus" value={`(${world.scannerX}, ${world.scannerY})`} />
          <Gauge label="Target Figure" value={`Option ${world.activeCandidate}`} />
        </>
      }
    >
      <div className="space-y-4">
        {/* Main Matrix with Interactive UV Reticle */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 rounded-xl border border-indigo-200 flex flex-col items-center justify-center relative shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between w-full max-w-sm">
            <span>Main Matrix: Figure (X)</span>
            <span className="text-indigo-600 font-mono">UV Filter: {world.uvIntensity}%</span>
          </div>

          <div className="w-full max-w-xs aspect-square relative">
            <svg viewBox="0 0 260 260" className="w-full h-full drop-shadow-md bg-white rounded-xl border-2 border-slate-200 p-2">
              <defs>
                <radialGradient id="uvBeam" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Complex Matrix Geometry */}
              <rect x="20" y="20" width="220" height="220" fill="#f8fafc" stroke="#64748b" strokeWidth="2.5" />
              <line x1="20" y1="20" x2="240" y2="240" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="240" y1="20" x2="20" y2="240" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="130" cy="130" r="80" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="130" cy="130" r="40" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="130" y1="20" x2="130" y2="240" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="20" y1="130" x2="240" y2="130" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Embedded Anchor Motif in Lower-Central Sector */}
              <g className="transition-opacity duration-300">
                {/* Horizontal crossbar */}
                <line x1="70" y1="80" x2="190" y2="80" stroke={world.activeCandidate === "A" ? "#4f46e5" : "#475569"} strokeWidth={world.activeCandidate === "A" ? "4" : "2"} strokeLinecap="round" />
                {/* Diagonal anchor struts */}
                <line x1="70" y1="80" x2="130" y2="180" stroke={world.activeCandidate === "A" ? "#4f46e5" : "#475569"} strokeWidth={world.activeCandidate === "A" ? "4" : "2"} strokeLinecap="round" />
                <line x1="190" y1="80" x2="130" y2="180" stroke={world.activeCandidate === "A" ? "#4f46e5" : "#475569"} strokeWidth={world.activeCandidate === "A" ? "4" : "2"} strokeLinecap="round" />
                {/* Vertical center stem */}
                <line x1="130" y1="180" x2="130" y2="225" stroke={world.activeCandidate === "A" ? "#4f46e5" : "#475569"} strokeWidth={world.activeCandidate === "A" ? "4" : "2"} strokeLinecap="round" />
                {/* Bottom foot bar */}
                <line x1="95" y1="225" x2="165" y2="225" stroke={world.activeCandidate === "A" ? "#4f46e5" : "#475569"} strokeWidth={world.activeCandidate === "A" ? "4" : "2"} strokeLinecap="round" />
              </g>

              {/* Interactive UV Spotlight Reticle */}
              <circle cx={world.scannerX} cy={world.scannerY} r="65" fill="url(#uvBeam)" />
              <circle cx={world.scannerX} cy={world.scannerY} r="32" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1={world.scannerX - 40} y1={world.scannerY} x2={world.scannerX + 40} y2={world.scannerY} stroke="#4f46e5" strokeWidth="1" />
              <line x1={world.scannerX} y1={world.scannerY - 40} x2={world.scannerX} y2={world.scannerY + 40} stroke="#4f46e5" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* 4 Candidate Option Cards */}
        <Bay label="Candidate Figures (Select Option A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                id: "A" as const,
                title: "Option A",
                subtitle: "T-Anchor with Base Bar",
                renderSvg: () => (
                  <svg viewBox="0 0 90 90" className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-lg p-1.5 my-1">
                    <rect x="8" y="8" width="74" height="74" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="22" y1="22" x2="68" y2="22" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
                    <line x1="22" y1="22" x2="45" y2="58" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
                    <line x1="68" y1="22" x2="45" y2="58" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
                    <line x1="45" y1="58" x2="45" y2="76" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
                    <line x1="30" y1="76" x2="60" y2="76" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                id: "B" as const,
                title: "Option B",
                subtitle: "Circle with Inscribed X",
                renderSvg: () => (
                  <svg viewBox="0 0 90 90" className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-lg p-1.5 my-1">
                    <circle cx="45" cy="45" r="34" fill="none" stroke="#64748b" strokeWidth="1.5" />
                    <line x1="22" y1="22" x2="68" y2="68" stroke="#64748b" strokeWidth="2" />
                    <line x1="68" y1="22" x2="22" y2="68" stroke="#64748b" strokeWidth="2" />
                  </svg>
                ),
              },
              {
                id: "C" as const,
                title: "Option C",
                subtitle: "Triangle with Circle Center",
                renderSvg: () => (
                  <svg viewBox="0 0 90 90" className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-lg p-1.5 my-1">
                    <polygon points="45,12 78,72 12,72" fill="none" stroke="#64748b" strokeWidth="2" />
                    <circle cx="45" cy="50" r="14" fill="none" stroke="#64748b" strokeWidth="1.5" />
                  </svg>
                ),
              },
              {
                id: "D" as const,
                title: "Option D",
                subtitle: "Cross in Diamond Frame",
                renderSvg: () => (
                  <svg viewBox="0 0 90 90" className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-lg p-1.5 my-1">
                    <rect x="18" y="18" width="54" height="54" transform="rotate(45 45 45)" fill="none" stroke="#64748b" strokeWidth="2" />
                    <line x1="18" y1="45" x2="72" y2="45" stroke="#64748b" strokeWidth="2" />
                    <line x1="45" y1="18" x2="45" y2="72" stroke="#64748b" strokeWidth="2" />
                  </svg>
                ),
              },
            ].map((opt) => {
              const isSelected = world.activeCandidate === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => selectCandidate(opt.id)}
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

                  <span className="text-[10px] text-slate-500 font-medium">{opt.subtitle}</span>
                  <button
                    type="button"
                    className={`mt-2 text-[10px] font-bold px-2 py-1 rounded w-full transition-colors ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected ? "Selected" : "Choose " + opt.id}
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
   Q7 — 🏷️ Word-Swap Semantic Switchboard
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
        note: `Submitted alias: ${w.activeChoice}`,
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
      live={<Gauge label="Selected Alias" value={world.activeChoice} />}
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
                    <span className="text-slate-400 font-bold">→</span>
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
   Q8 — 🧱 Brick Wall Restoration Studio (Draggable Masonry Simulator)
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
      const desc = `Piece ${w.placedPiece}`;
      return {
        value: desc,
        optionId: matchOption(question, w.placedPiece) ?? matchText(question, w.placedPiece) ?? w.placedPiece,
        note: `Submitted brick piece: Piece ${w.placedPiece}`,
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
        {/* Realistic Masonry Wall Canvas */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 rounded-xl border border-amber-200 flex flex-col items-center shadow-sm">
          <div className="w-full max-w-md relative">
            <svg viewBox="0 0 320 200" className="w-full h-auto bg-gradient-to-b from-[#b45309] to-[#92400e] rounded-xl border-4 border-[#78350f] shadow-md">
              <defs>
                <linearGradient id="brickGradMain" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="50%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                <linearGradient id="brickGradSlot" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>

              {/* Row 1 */}
              <rect x="5" y="5" width="70" height="42" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
              <rect x="80" y="5" width="75" height="42" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
              <rect x="160" y="5" width="75" height="42" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
              <rect x="240" y="5" width="75" height="42" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2.5" rx="2" />

              {/* Row 2 */}
              <rect x="5" y="52" width="110" height="42" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
              <rect x="120" y="52" width="80" height="42" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
              <rect x="205" y="52" width="110" height="42" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2.5" rx="2" />

              {/* Row 3 - Left fixed */}
              <rect x="5" y="99" width="75" height="42" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
              <rect x="85" y="99" width="70" height="42" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2.5" rx="2" />

              {/* Row 4 - Left fixed */}
              <rect x="5" y="146" width="115" height="48" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
              <rect x="125" y="146" width="30" height="48" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2.5" rx="2" />

              {/* Missing Quadrant Slot (x=160, y=99, w=155, h=95) */}
              <g transform="translate(160, 99)">
                <rect x="0" y="0" width="155" height="95" fill="#451a03" stroke="#facc15" strokeWidth="2.5" strokeDasharray="5 5" rx="3" />

                {world.placedPiece === "A" && (
                  <g>
                    <rect x="3" y="3" width="70" height="42" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2" />
                    <rect x="78" y="3" width="74" height="42" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2" />
                    <rect x="3" y="48" width="70" height="44" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2" />
                    <rect x="78" y="48" width="74" height="44" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2" />
                  </g>
                )}

                {world.placedPiece === "B" && (
                  <g>
                    <rect x="3" y="3" width="74" height="42" fill="url(#brickGradSlot)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
                    <rect x="82" y="3" width="70" height="42" fill="url(#brickGradSlot)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
                    <rect x="3" y="48" width="35" height="44" fill="url(#brickGradSlot)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
                    <rect x="43" y="48" width="74" height="44" fill="url(#brickGradSlot)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
                    <rect x="122" y="48" width="30" height="44" fill="url(#brickGradSlot)" stroke="#fde68a" strokeWidth="2.5" rx="2" />
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
                    <rect x="3" y="3" width="149" height="89" fill="url(#brickGradMain)" stroke="#fde68a" strokeWidth="2" rx="2" />
                    <text x="77" y="50" fill="#fef3c7" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Solid Block
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
            Click any candidate brick piece below to test if it restores the masonry bond:
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
              return (
                <div
                  key={opt.id}
                  onClick={() => set({ placedPiece: opt.id })}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center ${
                    isSelected
                      ? "bg-amber-50 border-amber-600 shadow-md ring-2 ring-amber-200"
                      : "bg-white border-slate-200 hover:border-amber-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <span className="font-bold text-xs text-slate-800">{opt.title}</span>
                    {isSelected && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        Selected
                      </span>
                    )}
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
   Q9 — 📄 3D Transparent Folding Studio
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
      const desc = `Folded Figure ${w.chosenOption}`;
      return {
        value: desc,
        optionId: matchOption(question, w.chosenOption) ?? matchText(question, w.chosenOption) ?? w.chosenOption,
        note: `Submitted folded pattern: Option ${w.chosenOption}`,
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
        {/* 3D Transparent Folding Stage */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 rounded-xl border border-indigo-200 flex flex-col items-center justify-center relative shadow-sm">
          <div className="w-full max-w-xs flex justify-center py-2">
            <svg viewBox="0 0 200 160" className="w-56 h-44 drop-shadow-md">
              <defs>
                <linearGradient id="transSheet" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Left Fixed Half */}
              <rect x="20" y="20" width="80" height="120" fill="url(#transSheet)" stroke="#6366f1" strokeWidth="2" rx="2" />
              {/* Left Static Shapes */}
              <rect x="45" y="40" width="30" height="30" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
              <polygon points="60,90 40,125 80,125" fill="#10b981" stroke="#059669" strokeWidth="1.5" />

              {/* Central Fold Crease */}
              <line x1="100" y1="15" x2="100" y2="145" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="5 4" />

              {/* Right Folding Flap */}
              <g
                transform={`translate(100, 0) scale(${1 - (world.foldPercent / 100) * 2}, 1) translate(-100, 0)`}
                opacity={Math.max(0.2, 1 - (world.foldPercent / 100) * 0.4)}
              >
                <rect x="100" y="20" width="80" height="120" fill="url(#transSheet)" stroke="#6366f1" strokeWidth="2" rx="2" />
                <circle cx="140" cy="55" r="14" fill="#3b82f6" fillOpacity="0.75" stroke="#1d4ed8" strokeWidth="1.5" />
                <polygon points="140,125 120,90 160,90" fill="#ec4899" fillOpacity="0.75" stroke="#be185d" strokeWidth="1.5" />
              </g>
            </svg>
          </div>

          {/* Fold Progress Controls */}
          <div className="w-full max-w-sm flex flex-col items-center gap-2 mt-2">
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

        {/* 4 Candidate Option Cards */}
        <Bay label="Candidate Superimposed Figures (Select A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                id: "A" as const,
                title: "Option A",
                subtitle: "Circle and Square Apart",
                renderSvg: () => (
                  <svg viewBox="0 0 100 100" className="w-20 h-20 bg-slate-50 rounded-lg border border-slate-200 p-1">
                    <rect x="20" y="10" width="60" height="80" fill="#e0e7ff" fillOpacity="0.4" stroke="#6366f1" strokeWidth="1.5" />
                    <rect x="35" y="20" width="30" height="30" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
                    <circle cx="50" cy="70" r="12" fill="#3b82f6" fillOpacity="0.7" stroke="#1d4ed8" strokeWidth="1.5" />
                  </svg>
                ),
              },
              {
                id: "B" as const,
                title: "Option B",
                subtitle: "Opposite Diagonal Halves",
                renderSvg: () => (
                  <svg viewBox="0 0 100 100" className="w-20 h-20 bg-slate-50 rounded-lg border border-slate-200 p-1">
                    <rect x="20" y="10" width="60" height="80" fill="#e0e7ff" fillOpacity="0.4" stroke="#6366f1" strokeWidth="1.5" />
                    <polygon points="50,20 70,50 30,50" fill="#10b981" stroke="#059669" strokeWidth="1" />
                    <polygon points="50,60 70,90 30,90" fill="#ec4899" stroke="#be185d" strokeWidth="1" />
                  </svg>
                ),
              },
              {
                id: "C" as const,
                title: "Option C",
                subtitle: "Single Crossed Triangle",
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
              return (
                <div
                  key={opt.id}
                  onClick={() => set((prev) => ({ ...prev, chosenOption: opt.id }))}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm"
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
   Q10 — 🧭 GPS Radar & Coordinate Navigation Simulator
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
      const dist = w.chosenOption === "C" ? 35 : w.chosenOption === "A" ? 25 : w.chosenOption === "B" ? 30 : 40;
      return {
        value: `${dist} metres`,
        optionId: matchOption(question, w.chosenOption) ?? matchNumber(question, dist) ?? w.chosenOption,
        note: `Submitted distance: ${dist} metres`,
      };
    },
  });

  return (
    <PlayShell
      title="Coordinate Navigation Simulator"
      mission="Trace the paths of two explorers moving across cardinal coordinates and determine the straight-line distance between them."
      icon={Compass}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Measured Distance" value={world.chosenOption === "C" ? "35 metres (Option C)" : world.chosenOption === "A" ? "25 metres (Option A)" : world.chosenOption === "B" ? "30 metres (Option B)" : "40 metres (Option D)"} />}
    >
      <div className="space-y-4">
        {/* Radar Screen Navigation Canvas */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 rounded-xl border border-indigo-500/30 text-white flex flex-col items-center shadow-lg relative">
          <div className="text-xs font-mono font-bold text-cyan-400 mb-2 flex items-center justify-between w-full max-w-md">
            <span className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5" /> GPS Vector Tracking
            </span>
            <span className="text-emerald-400">Scale: 1 grid = 5 metres</span>
          </div>

          <div className="w-full max-w-md aspect-[4/3] relative">
            <svg viewBox="0 0 320 240" className="w-full h-full bg-slate-950/60 rounded-xl border border-cyan-500/30">
              <defs>
                <pattern id="radarGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0369a1" strokeWidth="0.5" strokeOpacity="0.4" />
                </pattern>
              </defs>

              <rect width="320" height="240" fill="url(#radarGrid)" />

              {/* Cardinal Compass Directions */}
              <text x="160" y="18" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">NORTH</text>
              <text x="160" y="234" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">SOUTH</text>
              <text x="12" y="124" fill="#38bdf8" fontSize="11" fontWeight="bold">WEST</text>
              <text x="282" y="124" fill="#38bdf8" fontSize="11" fontWeight="bold">EAST</text>

              {/* Origin Point O */}
              <circle cx="100" cy="120" r="4" fill="#f59e0b" />
              <text x="88" y="124" fill="#fcd34d" fontSize="10" fontWeight="black">O (Start)</text>

              {/* Path 1: Person A (North 20m, then East 15m) */}
              <path d="M 100 120 L 100 40 L 160 40" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              <circle cx="160" cy="40" r="5" fill="#38bdf8" />
              <text x="170" y="44" fill="#38bdf8" fontSize="10" fontWeight="bold">Person A (North+East)</text>

              {/* Path 2: Person B (South 15m, then East 20m) */}
              <path d="M 100 120 L 100 180 L 180 180" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
              <circle cx="180" cy="180" r="5" fill="#f43f5e" />
              <text x="190" y="184" fill="#f43f5e" fontSize="10" fontWeight="bold">Person B (South+East)</text>

              {/* Dynamic Laser Rangefinder Line */}
              <line x1="160" y1="40" x2="180" y2="180" stroke="#facc15" strokeWidth="2.5" strokeDasharray="5 4" />
              <circle cx="170" cy="110" r="16" fill="#1e1b4b" stroke="#facc15" strokeWidth="1.5" />
              <text x="170" y="114" fill="#facc15" fontSize="10" fontWeight="black" textAnchor="middle">
                {world.chosenOption === "C" ? "35m" : world.chosenOption === "A" ? "25m" : world.chosenOption === "B" ? "30m" : "40m"}
              </text>
            </svg>
          </div>
        </div>

        {/* 4 Candidate Option Cards */}
        <Bay label="Select the Distance Between Both Persons (A, B, C, or D)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "A" as const, dist: "25 metres" },
              { id: "B" as const, dist: "30 metres" },
              { id: "C" as const, dist: "35 metres" },
              { id: "D" as const, dist: "40 metres" },
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

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Crosshair, UserCheck, PenTool, Scissors, Cpu, CheckCircle2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, PlayCanvas } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q6 — The Laser Alignment Lab (Dot Placement Conditions)
   Dot 1: in Circle and Square only.
   Dot 2: in Triangle and Circle only.
   Candidate tests 4 figure configurations; validates Option D.
   ══════════════════════════════════════════════════════════════════════ */

export function Q06LaserAlignmentLabActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ selectedFig: string | null; tested: boolean }>({
    question,
    initial: { selectedFig: null, tested: false },
    derive: (w) => {
      if (!w.selectedFig) return { note: "Select and test a candidate figure under the regional dot laser." };
      return { value: w.selectedFig, optionId: matchOption(question, w.selectedFig) ?? w.selectedFig };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;

  return (
    <Shell
      play={play}
      question={question}
      title="The Dot Placement Criteria Inspector"
      mission="Study the dot conditions in the problem figure (one dot in Triangle ∩ Square, another in Circle only). Scan candidate figures to find the one satisfying identical spatial intersection zones."
      icon={Crosshair}
      dim="2D"
      submitLabel="Submit Valid Dot Configuration"
      hints={[
        "Check Dot 1: It lies inside the Triangle and Square simultaneously, but outside the Circle.",
        "Check Dot 2: It lies exclusively inside the Circle.",
        "Scan the candidates: Only Figure B has independent regions for both required intersections.",
      ]}
      live={
        <>
          <Gauge label="Scanned Figure" value={w.selectedFig ?? "None"} tone={w.selectedFig === "B" ? "emerald" : "indigo"} />
          <Gauge label="Dot Criteria Valid" value={w.selectedFig === "B" ? "100% Match" : w.selectedFig ? "Invalid" : "Waiting"} tone={w.selectedFig === "B" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <PlayCanvas height="h-56" className="bg-gradient-to-br from-indigo-50/40 via-white to-sky-50/40 flex-col">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-900 mb-1">Reference Figure Dot Conditions</div>
          <svg viewBox="0 0 180 110" className="w-56 h-36">
            <circle cx="70" cy="55" r="40" fill="#dbeafe" fillOpacity="0.6" stroke="#3b82f6" strokeWidth="2" />
            <rect x="60" y="30" width="65" height="55" fill="#f3e8ff" fillOpacity="0.6" stroke="#a855f7" strokeWidth="2" />
            <polygon points="95,15 150,95 40,95" fill="#d1fae5" fillOpacity="0.5" stroke="#10b981" strokeWidth="2" />
            {/* Dots */}
            <circle cx="85" cy="72" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <text x="85" y="85" fill="#991b1b" fontSize="7" fontWeight="bold" textAnchor="middle">Dot 1</text>
            <circle cx="48" cy="50" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <text x="48" y="40" fill="#991b1b" fontSize="7" fontWeight="bold" textAnchor="middle">Dot 2</text>
          </svg>
        </PlayCanvas>
      </Board>

      <Bay label="Candidate Figures" tone="indigo">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["A", "B", "C", "D"].map((opt) => (
            <Btn
              key={opt}
              tone={w.selectedFig === opt ? "emerald" : "slate"}
              disabled={play.readOnly}
              onClick={() => play.patch({ selectedFig: opt, tested: true })}
            >
              Analyze Figure {opt}
            </Btn>
          ))}
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q7 — The School Ranking Ceremony (Gautam: 15th from bottom of 28)
   Total: 28. Position from top = 28 - 15 + 1 = 14th.
   Candidate operates ranking elevator to position Gautam.
   ══════════════════════════════════════════════════════════════════════ */

export function Q07SchoolRankingCeremonyActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const total = 28;
  const play = usePlay<{ rankTop: number }>({
    question,
    initial: { rankTop: 1 },
    derive: (w) => {
      const rankFromBottom = total - w.rankTop + 1;
      return {
        value: `${w.rankTop}th`,
        optionId: matchText(question, `${w.rankTop}th`),
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;
  const rankFromBottom = total - w.rankTop + 1;

  return (
    <Shell
      play={play}
      question={question}
      title="The School Assembly Ranking Board"
      mission="In a class of 28 students, Gautam is 15th from the bottom. Operate the ranking elevator to position Gautam so his rank from the bottom is exactly 15th, and read his rank from the top."
      icon={UserCheck}
      dim="2D"
      submitLabel="Submit Rank From Top"
      hints={[
        "Formula: Rank from Top = (Total Students - Rank from Bottom) + 1.",
        "Rank from Top = (28 - 15) + 1 = 13 + 1 = 14th.",
      ]}
      live={
        <>
          <Gauge label="Rank from Top" value={`${w.rankTop}th`} tone={w.rankTop === 14 ? "emerald" : "indigo"} />
          <Gauge label="Rank from Bottom" value={`${rankFromBottom}th`} tone={rankFromBottom === 15 ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex flex-col justify-between border border-indigo-100 shadow-xs space-y-4">
          <div className="flex justify-between text-xs font-black text-slate-600">
            <span>🔝 Top Rank: 1st</span>
            <span>🔻 Bottom Rank: 28th</span>
          </div>

          {/* Ranking Track */}
          <div className="relative w-full h-14 bg-gradient-to-r from-indigo-50 via-slate-50 to-violet-50 rounded-xl p-2 flex items-center border border-indigo-200">
            <div
              className="absolute h-10 px-3.5 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md transition-all"
              style={{ left: `${((w.rankTop - 1) / (total - 1)) * 82}%` }}
            >
              👦 Gautam ({w.rankTop}th from Top)
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800">
            <span>Rank from Top: <strong className="text-indigo-600 font-mono text-sm">{w.rankTop}th</strong></span>
            <span>Rank from Bottom: <strong className="text-violet-600 font-mono text-sm">{rankFromBottom}th</strong></span>
          </div>
        </div>
      </Board>

      <Bay label="Elevator Controls" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="slate" disabled={play.readOnly || w.rankTop <= 1} onClick={() => play.patch({ rankTop: Math.max(1, w.rankTop - 1) })}>
            ▲ Move Up
          </Btn>
          <Btn tone="slate" disabled={play.readOnly || w.rankTop >= total} onClick={() => play.patch({ rankTop: Math.min(total, w.rankTop + 1) })}>
            ▼ Move Down
          </Btn>
          <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ rankTop: 14 })}>
            🎯 Lock to 15th from Bottom (14th from Top)
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q8 — The Line-Drawing Engine (Minimum Straight Lines)
   Drafting robot constructs the figure using minimum continuous straight strokes.
   Figure requires 11 straight lines.
   ══════════════════════════════════════════════════════════════════════ */

export function Q08LineDrawingEngineActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ drawnCount: number }>({
    question,
    initial: { drawnCount: 0 },
    derive: (w) => {
      if (w.drawnCount === 0) return { note: "Draw all unique straight continuous lines required to build the figure." };
      return {
        value: `${w.drawnCount}`,
        optionId: matchNumber(question, w.drawnCount),
      };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;

  return (
    <Shell
      play={play}
      question={question}
      title="The Precision Line Drafter"
      mission="Operate the precision drafting tool to construct the geometric figure using the absolute minimum number of straight continuous line strokes (11 lines total)."
      icon={PenTool}
      dim="2D"
      submitLabel="Submit Line Count"
      hints={[
        "Count horizontal lines: 3 lines.",
        "Count vertical lines: 3 lines.",
        "Count diagonal and slant lines: 5 lines.",
        "Total minimum straight lines = 3 + 3 + 5 = 11 lines.",
      ]}
      live={
        <>
          <Gauge label="Lines Drawn" value={`${w.drawnCount}`} tone={w.drawnCount === 11 ? "emerald" : "indigo"} />
          <Gauge label="Blueprint Status" value={w.drawnCount === 11 ? "Complete (100%)" : `${Math.round((w.drawnCount / 11) * 100)}%`} tone={w.drawnCount === 11 ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <PlayCanvas height="h-56" className="bg-gradient-to-br from-slate-50 to-indigo-50/30">
          <svg viewBox="0 0 200 130" className="w-full h-full">
            {/* Outline Box */}
            <rect x="35" y="15" width="130" height="90" fill="none" stroke={w.drawnCount >= 4 ? "#4f46e5" : "#cbd5e1"} strokeWidth="2.5" />
            {/* Diagonals & cross lines */}
            <line x1="35" y1="15" x2="165" y2="105" stroke={w.drawnCount >= 6 ? "#0284c7" : "#e2e8f0"} strokeWidth="2" />
            <line x1="165" y1="15" x2="35" y2="105" stroke={w.drawnCount >= 8 ? "#0284c7" : "#e2e8f0"} strokeWidth="2" />
            <line x1="100" y1="15" x2="100" y2="105" stroke={w.drawnCount >= 9 ? "#9333ea" : "#e2e8f0"} strokeWidth="2" />
            <line x1="35" y1="60" x2="165" y2="60" stroke={w.drawnCount >= 10 ? "#9333ea" : "#e2e8f0"} strokeWidth="2" />
            <polygon points="100,15 165,60 100,105 35,60" fill="none" stroke={w.drawnCount >= 11 ? "#059669" : "#e2e8f0"} strokeWidth="2.5" />
          </svg>
        </PlayCanvas>
      </Board>

      <Bay label="Drafting Controls" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="slate" disabled={play.readOnly || w.drawnCount <= 0} onClick={() => play.patch({ drawnCount: Math.max(0, w.drawnCount - 1) })}>
            Undo Stroke
          </Btn>
          <Btn tone="indigo" disabled={play.readOnly || w.drawnCount >= 11} onClick={() => play.patch({ drawnCount: Math.min(11, w.drawnCount + 1) })}>
            + Draw Stroke
          </Btn>
          <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ drawnCount: 11 })}>
            ⚡ Construct All 11 Straight Lines
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q9 — The Origami Lab (Paper Folding P -> Q -> R)
   Candidate folds paper sheet, applies punch cut, unfolds to derive Pattern C.
   ══════════════════════════════════════════════════════════════════════ */

export function Q09OrigamiLabActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ foldStep: number; unfolded: boolean }>({
    question,
    initial: { foldStep: 0, unfolded: false },
    derive: (w) => {
      if (!w.unfolded) return { note: "Fold paper through P → Q → R, apply corner cut, and unfold." };
      return { value: "Pattern C", optionId: "C" };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;

  return (
    <Shell
      play={play}
      question={question}
      title="The Origami Folding & Punching Studio"
      mission="A square paper is folded along the horizontal midline (P), then along the vertical midline (Q). A triangular notch is cut out of the folded corner (R). Unfold the sheet to discover the complete symmetrical punched pattern (Pattern C)."
      icon={Scissors}
      dim="2D"
      submitLabel="Submit Unfolded Pattern"
      hints={[
        "When folded twice, the sheet has 4 layers.",
        "A single triangular cut on the central folded corner creates 4 mirrored diamond cuts across the 4 quadrants when unfolded.",
        "This yields Pattern C.",
      ]}
      live={
        <>
          <Gauge label="Folding Phase" value={w.foldStep === 0 ? "P (Flat)" : w.foldStep === 1 ? "Q (Fold 1)" : "R (Cut Ready)"} tone="violet" />
          <Gauge label="Unfolded Pattern" value={w.unfolded ? "Pattern C" : "Folded"} tone={w.unfolded ? "emerald" : "indigo"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex items-center justify-around border border-indigo-100 shadow-xs min-h-[160px]">
          {!w.unfolded ? (
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="text-center">
                <div className="text-[10px] font-bold text-slate-500 mb-1">FIG P (Half)</div>
                <div className="w-16 h-16 bg-indigo-100 border-2 border-indigo-300 rounded-sm" />
              </div>
              <div className="text-slate-400 font-bold">→</div>
              <div className="text-center">
                <div className="text-[10px] font-bold text-slate-500 mb-1">FIG Q (Quarter)</div>
                <div className="w-12 h-12 bg-indigo-200 border-2 border-indigo-400 rounded-sm" />
              </div>
              <div className="text-slate-400 font-bold">→</div>
              <div className="text-center">
                <div className="text-[10px] font-bold text-slate-500 mb-1">FIG R (Cut)</div>
                <div className="w-12 h-12 bg-indigo-300 border-2 border-red-400 rounded-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-4 h-4 bg-red-500" />
                </div>
              </div>
            </div>
          ) : (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className="text-xs font-black text-emerald-700 mb-1.5">UNFOLDED SYMMETRY (Pattern C)</div>
              <div className="w-32 h-32 bg-indigo-50 border-2 border-emerald-500 rounded-lg relative grid grid-cols-2 grid-rows-2 p-1.5 gap-1.5 shadow-xs">
                <div className="relative border border-indigo-200 bg-white flex items-center justify-center rounded">
                  <div className="w-4 h-4 bg-emerald-500 rotate-45" />
                </div>
                <div className="relative border border-indigo-200 bg-white flex items-center justify-center rounded">
                  <div className="w-4 h-4 bg-emerald-500 rotate-45" />
                </div>
                <div className="relative border border-indigo-200 bg-white flex items-center justify-center rounded">
                  <div className="w-4 h-4 bg-emerald-500 rotate-45" />
                </div>
                <div className="relative border border-indigo-200 bg-white flex items-center justify-center rounded">
                  <div className="w-4 h-4 bg-emerald-500 rotate-45" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Board>

      <Bay label="Origami Controls" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="violet" disabled={play.readOnly} onClick={() => play.patch({ foldStep: (w.foldStep + 1) % 3 })}>
            Fold Step ({w.foldStep + 1}/3)
          </Btn>
          <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ unfolded: true, foldStep: 2 })}>
            ✂️ Cut & Unfold Sheet (Pattern C)
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q10 — The Operator Power Grid (17 B 33 A 11 C 5 D 2)
   A: ÷, B: +, C: −, D: ×
   Expression: 17 + (33 ÷ 11) - (5 × 2) = 17 + 3 - 10 = 10 (Option D)
   ══════════════════════════════════════════════════════════════════════ */

export function Q10OperatorPowerGridActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ opsSlotted: boolean; evaluated: boolean }>({
    question,
    initial: { opsSlotted: false, evaluated: false },
    derive: (w) => {
      if (!w.opsSlotted || !w.evaluated) {
        return { note: "Slot arithmetic modules (A=÷, B=+, C=−, D=×) and trigger grid power flow." };
      }
      return { value: "10", optionId: matchNumber(question, 10) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;

  return (
    <Shell
      play={play}
      question={question}
      title="The BODMAS Operator Substitution Grid"
      mission="Map the symbolic operator modules: A → ÷, B → +, C → −, D → ×. Slot them into the power circuit: 17 [B] 33 [A] 11 [C] 5 [D] 2 and evaluate intermediate energy flows using BODMAS rules."
      icon={Cpu}
      dim="2D"
      submitLabel="Submit Circuit Value"
      hints={[
        "Expression: 17 + (33 ÷ 11) − (5 × 2).",
        "Division: 33 ÷ 11 = 3.",
        "Multiplication: 5 × 2 = 10.",
        "Combine: 17 + 3 − 10 = 20 − 10 = 10.",
      ]}
      live={
        <>
          <Gauge label="Circuit Status" value={w.evaluated ? "Evaluated" : w.opsSlotted ? "Powered" : "Open"} tone={w.evaluated ? "emerald" : "indigo"} />
          <Gauge label="Final Output" value={w.evaluated ? "10" : "---"} tone={w.evaluated ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex flex-col justify-center gap-3 border border-indigo-100 shadow-xs">
          {/* Circuit Pipeline */}
          <div className="flex items-center justify-around text-center flex-wrap gap-1.5">
            <div className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 font-mono font-black text-lg text-indigo-950">17</div>
            <div className="font-mono text-base font-bold text-amber-600">{w.opsSlotted ? "+" : "[B]"}</div>
            <div className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 font-mono font-black text-lg text-indigo-950">33</div>
            <div className="font-mono text-base font-bold text-amber-600">{w.opsSlotted ? "÷" : "[A]"}</div>
            <div className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 font-mono font-black text-lg text-indigo-950">11</div>
            <div className="font-mono text-base font-bold text-amber-600">{w.opsSlotted ? "−" : "[C]"}</div>
            <div className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 font-mono font-black text-lg text-indigo-950">5</div>
            <div className="font-mono text-base font-bold text-amber-600">{w.opsSlotted ? "×" : "[D]"}</div>
            <div className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 font-mono font-black text-lg text-indigo-950">2</div>
          </div>

          {/* Evaluation Flow */}
          {w.evaluated && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center font-mono text-sm font-bold text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-300">
              = 17 + 3 − 10 = 20 − 10 = <span className="text-lg font-black text-emerald-600">10</span>
            </motion.div>
          )}
        </div>
      </Board>

      <Bay label="Grid Controls" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="violet" disabled={play.readOnly} onClick={() => play.patch({ opsSlotted: true })}>
            🔌 Slot Modules (A=÷, B=+, C=−, D=×)
          </Btn>
          <Btn tone="emerald" disabled={play.readOnly || !w.opsSlotted} onClick={() => play.patch({ evaluated: true })}>
            ⚡ Evaluate Expression Flow (10)
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

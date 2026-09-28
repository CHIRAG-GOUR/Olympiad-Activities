"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Crosshair, UserCheck, PenTool, Scissors, Cpu } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board } from "./kit";

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
      title="The Laser Alignment Lab"
      mission="Study the dot conditions in the problem figure (one dot in Triangle ∩ Square, another in Circle only). Scan candidate figures to find the one satisfying identical spatial intersection zones."
      icon={Crosshair}
      dim="2D"
      submitLabel="Submit Valid Dot Configuration"
      hints={[
        "Check Dot 1: It lies inside the Triangle and Square simultaneously, but outside the Circle.",
        "Check Dot 2: It lies exclusively inside the Circle.",
        "Scan the candidates: Only Figure D has independent regions for both required intersections.",
      ]}
      live={
        <>
          <Gauge label="Scanned Figure" value={w.selectedFig ?? "None"} tone={w.selectedFig === "D" ? "emerald" : "indigo"} />
          <Gauge label="Dot Criteria Valid" value={w.selectedFig === "D" ? "100% Match" : w.selectedFig ? "Invalid" : "Waiting"} tone={w.selectedFig === "D" ? "emerald" : "amber"} />
        </>
      }
    >
      <Board>
        <div className="flex flex-col items-center justify-center p-3 bg-slate-900 rounded-xl border border-slate-700">
          <div className="text-xs font-bold text-sky-300 mb-2">REFERENCE FIGURE CONDITIONS</div>
          <svg viewBox="0 0 160 100" className="w-48 h-28">
            <circle cx="60" cy="50" r="35" fill="#3b82f6" fillOpacity="0.25" stroke="#60a5fa" strokeWidth="2" />
            <rect x="50" y="30" width="55" height="50" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="2" />
            <polygon points="80,15 130,85 30,85" fill="#10b981" fillOpacity="0.2" stroke="#34d399" strokeWidth="2" />
            {/* Dots */}
            <circle cx="70" cy="65" r="3.5" fill="#ef4444" stroke="#fff" strokeWidth="1" />
            <circle cx="40" cy="45" r="3.5" fill="#ef4444" stroke="#fff" strokeWidth="1" />
          </svg>
        </div>
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
        optionId: matchText(question, `${w.rankTop}th`) ?? (w.rankTop === 14 ? "A" : undefined),
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
      mission="In a class of 28 students, Gautam is 15th from the bottom. Operate the vertical ranking elevator to position Gautam so his rank from the bottom is exactly 15th, and read his rank from the top."
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
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex flex-col justify-between border border-slate-700">
          <div className="flex justify-between text-xs font-bold text-slate-400">
            <span>🔝 Top Rank: 1st</span>
            <span>🔻 Bottom Rank: 28th</span>
          </div>

          {/* Ranking Elevator Slider */}
          <div className="relative w-full h-12 bg-slate-800 rounded-xl p-1.5 flex items-center border border-slate-700">
            <div
              className="absolute h-9 px-3 rounded-lg bg-indigo-600 border border-indigo-400 flex items-center justify-center text-white font-bold text-xs shadow-md transition-all"
              style={{ left: `${((w.rankTop - 1) / (total - 1)) * 80}%` }}
            >
              👦 Gautam ({w.rankTop}th)
            </div>
          </div>

          <div className="flex justify-between text-xs font-mono font-bold text-sky-400">
            <span>Rank from Top: {w.rankTop}th</span>
            <span>Rank from Bottom: {rankFromBottom}th</span>
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
  const lines = [
    "Outer Horizontal Top", "Outer Horizontal Bottom",
    "Outer Vertical Left", "Outer Vertical Right",
    "Inner Triangle Top-Left", "Inner Triangle Top-Right", "Inner Triangle Base",
    "Diagonal Beam 1", "Diagonal Beam 2", "Middle Divider", "Base Support",
  ];

  const play = usePlay<{ drawnCount: number }>({
    question,
    initial: { drawnCount: 0 },
    derive: (w) => {
      if (w.drawnCount === 0) return { note: "Draw all unique straight continuous lines required to build the figure." };
      return {
        value: `${w.drawnCount}`,
        optionId: matchNumber(question, w.drawnCount) ?? (w.drawnCount === 11 ? "D" : undefined),
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
      title="The Line-Drawing Engine"
      mission="Operate the precision drafting robot to construct the geometric blueprint using the absolute minimum number of straight continuous line strokes."
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
        <div className="w-full h-44 bg-slate-900 rounded-xl p-2 flex items-center justify-center border border-slate-700">
          <svg viewBox="0 0 200 120" className="w-full h-full">
            {/* Outline Box */}
            <rect x="40" y="20" width="120" height="80" fill="none" stroke={w.drawnCount >= 4 ? "#38bdf8" : "#334155"} strokeWidth="2.5" />
            {/* Diagonals & cross lines */}
            <line x1="40" y1="20" x2="160" y2="100" stroke={w.drawnCount >= 6 ? "#818cf8" : "#334155"} strokeWidth="2" />
            <line x1="160" y1="20" x2="40" y2="100" stroke={w.drawnCount >= 8 ? "#818cf8" : "#334155"} strokeWidth="2" />
            <line x1="100" y1="20" x2="100" y2="100" stroke={w.drawnCount >= 9 ? "#a855f7" : "#334155"} strokeWidth="2" />
            <line x1="40" y1="60" x2="160" y2="60" stroke={w.drawnCount >= 10 ? "#a855f7" : "#334155"} strokeWidth="2" />
            <polygon points="100,20 160,60 100,100 40,60" fill="none" stroke={w.drawnCount >= 11 ? "#34d399" : "#334155"} strokeWidth="2" />
          </svg>
        </div>
      </Board>

      <Bay label="Drafting Robot Controls" tone="indigo">
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
      title="The Origami Folding Lab"
      mission="A square paper is folded along the horizontal midline (P), then along the vertical midline (Q). A triangular notch is cut out of the folded corner (R). Unfold the sheet to discover the complete symmetrical punched pattern."
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
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex items-center justify-around border border-slate-700">
          {!w.unfolded ? (
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-[10px] font-bold text-slate-400 mb-1">FIG P (Half)</div>
                <div className="w-16 h-16 bg-indigo-800 border border-indigo-400 rounded-sm" />
              </div>
              <div className="text-slate-500 font-bold">→</div>
              <div className="text-center">
                <div className="text-[10px] font-bold text-slate-400 mb-1">FIG Q (Quarter)</div>
                <div className="w-12 h-12 bg-indigo-700 border border-indigo-400 rounded-sm" />
              </div>
              <div className="text-slate-500 font-bold">→</div>
              <div className="text-center">
                <div className="text-[10px] font-bold text-slate-400 mb-1">FIG R (Cut)</div>
                <div className="w-12 h-12 bg-indigo-600 border border-red-400 rounded-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 clip-triangle" />
                </div>
              </div>
            </div>
          ) : (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className="text-xs font-bold text-emerald-400 mb-1">UNFOLDED SYMMETRY (Pattern C)</div>
              <div className="w-28 h-28 bg-indigo-900 border-2 border-emerald-400 rounded-md relative grid grid-cols-2 grid-rows-2 p-1 gap-1">
                <div className="relative border border-indigo-700/50 flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-400 rotate-45" />
                </div>
                <div className="relative border border-indigo-700/50 flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-400 rotate-45" />
                </div>
                <div className="relative border border-indigo-700/50 flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-400 rotate-45" />
                </div>
                <div className="relative border border-indigo-700/50 flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-400 rotate-45" />
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
      return { value: "10", optionId: matchNumber(question, 10) ?? "D" };
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
      title="The Operator Power Grid"
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
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex flex-col justify-center gap-3 border border-slate-700">
          {/* Circuit Pipeline */}
          <div className="flex items-center justify-around text-center flex-wrap gap-1">
            <div className="px-3 py-1.5 rounded-lg bg-indigo-950 border border-indigo-500 font-mono font-black text-lg text-indigo-300">17</div>
            <div className="font-mono text-base font-bold text-amber-400">{w.opsSlotted ? "+" : "[B]"}</div>
            <div className="px-3 py-1.5 rounded-lg bg-indigo-950 border border-indigo-500 font-mono font-black text-lg text-indigo-300">33</div>
            <div className="font-mono text-base font-bold text-amber-400">{w.opsSlotted ? "÷" : "[A]"}</div>
            <div className="px-3 py-1.5 rounded-lg bg-indigo-950 border border-indigo-500 font-mono font-black text-lg text-indigo-300">11</div>
            <div className="font-mono text-base font-bold text-amber-400">{w.opsSlotted ? "−" : "[C]"}</div>
            <div className="px-3 py-1.5 rounded-lg bg-indigo-950 border border-indigo-500 font-mono font-black text-lg text-indigo-300">5</div>
            <div className="font-mono text-base font-bold text-amber-400">{w.opsSlotted ? "×" : "[D]"}</div>
            <div className="px-3 py-1.5 rounded-lg bg-indigo-950 border border-indigo-500 font-mono font-black text-lg text-indigo-300">2</div>
          </div>

          {/* Evaluation Flow */}
          {w.evaluated && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center font-mono text-xs font-bold text-emerald-300 bg-emerald-950/60 p-2 rounded-lg border border-emerald-500">
              = 17 + 3 − 10 = 20 − 10 = <span className="text-base text-emerald-200">10</span>
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

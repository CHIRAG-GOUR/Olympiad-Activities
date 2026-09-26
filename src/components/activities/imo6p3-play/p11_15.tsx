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
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q11 — ⚙️ Operator Factory
   ══════════════════════════════════════════════════════════════════════ */
interface Q11World {
  pVal: string;
  rVal: string;
  mVal: string;
  sVal: string;
  evaluatedResult: number | null;
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
    initial: {
      pVal: "×",
      rVal: "÷",
      mVal: "−",
      sVal: "+",
      evaluatedResult: 0,
    },
    derive: (w) => {
      if (w.evaluatedResult === 0) {
        return {
          value: "0 (3 + 7 − 10 = 0)",
          optionId: matchNumber(question, 0) ?? "D",
        };
      }
      return {
        value: w.evaluatedResult !== null ? String(w.evaluatedResult) : undefined,
        note: "Substitute operators and run calculation engine.",
      };
    },
  });

  return (
    <PlayShell
      title="Operator Factory"
      mission="Feed the operator modules into the expression machine and evaluate with BODMAS order."
      icon={Cog}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Calculated Output" value={world.evaluatedResult !== null ? String(world.evaluatedResult) : "Pending"} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-100 shadow-inner flex flex-col items-center">
          <div className="text-xs font-mono text-slate-500 mb-2">Original Symbolic Expression:</div>
          <div className="font-mono text-xl sm:text-2xl font-black text-amber-600 tracking-wider">
            24 <span className="text-indigo-600 font-extrabold">R</span> 8{" "}
            <span className="text-emerald-600 font-extrabold">S</span> 7{" "}
            <span className="text-rose-600 font-extrabold">M</span> 2{" "}
            <span className="text-cyan-600 font-extrabold">P</span> 5
          </div>

          <div className="w-full my-3 border-t border-indigo-200 pt-3 text-center">
            <div className="text-xs font-mono text-slate-500 mb-1">Mechanized Mathematical Sequence:</div>
            <div className="font-mono text-lg text-slate-200">
              24 ÷ 8 + 7 − 2 × 5
            </div>
            <div className="text-xs font-mono text-emerald-600 mt-1">
              Step 1: 3 + 7 − 10 &nbsp;→&nbsp; Step 2: 10 − 10 = 0
            </div>
          </div>
        </div>

        <Bay label="Active Operator Modules">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg">
              <span className="text-xs font-mono font-bold text-indigo-700">R = ÷ (Divide)</span>
            </div>
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="text-xs font-mono font-bold text-emerald-700">S = + (Add)</span>
            </div>
            <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg">
              <span className="text-xs font-mono font-bold text-rose-700">M = − (Subtract)</span>
            </div>
            <div className="p-2 bg-cyan-50 border border-cyan-200 rounded-lg">
              <span className="text-xs font-mono font-bold text-cyan-700">P = × (Multiply)</span>
            </div>
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q12 — 🎯 Geometric Dot Laboratory
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
      if (w.selectedOption === "A") {
        return {
          value: "Figure A (Preserves Overlap Regions)",
          optionId: matchText(question, "A") ?? "A",
        };
      }
      return {
        value: `Figure ${w.selectedOption}`,
        note: "Select the figure where all dot placement regions exist simultaneously.",
      };
    },
  });

  return (
    <PlayShell
      title="Geometric Dot Laboratory"
      mission="Inspect the relative containment regions of the dots in Figure X and identify the valid candidate."
      icon={Target}
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
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-amber-600">Figure X Reference</span>
            <p className="text-xs text-slate-600 mt-1">
              Dots are located in: (1) Circle & Triangle only; (2) Triangle & Square only.
            </p>
          </div>
          <svg viewBox="0 0 100 80" className="w-24 h-20 bg-white/60 rounded-lg border border-slate-200 p-1">
            <circle cx="35" cy="40" r="22" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="50,15 85,65 15,65" fill="none" stroke="#f43f5e" strokeWidth="2" />
            <rect x="40" y="25" width="45" height="45" fill="none" stroke="#a855f7" strokeWidth="2" />
            <circle cx="38" cy="48" r="3.5" fill="#facc15" />
            <circle cx="62" cy="52" r="3.5" fill="#facc15" />
          </svg>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(["A", "B", "C", "D"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => set({ selectedOption: opt })}
              className={`p-3 rounded-xl border-2 font-bold text-xs transition-all ${
                world.selectedOption === opt
                  ? opt === "A"
                    ? "bg-emerald-50 border-emerald-500 shadow-md text-emerald-900"
                    : "bg-indigo-50 border-indigo-400 text-indigo-900"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Option {opt} {opt === "A" && "✓"}
            </button>
          ))}
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q13 — 📚 Dictionary Conveyor
   ══════════════════════════════════════════════════════════════════════ */
interface Q13World {
  order: string[];
}

export function Q13DictionaryConveyorActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const WORDS = ["Fight", "Freak", "Faint", "Fault", "Flick"];
  const SORTED = ["Faint", "Fault", "Fight", "Flick", "Freak"];

  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q13World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { order: SORTED },
    derive: (w) => {
      const isCorrect = w.order.join(",") === SORTED.join(",");
      if (isCorrect) {
        return {
          value: "Faint → Fault → Fight → Flick → Freak",
          optionId: matchText(question, "D") ?? "D",
        };
      }
      return {
        value: w.order.join(" → "),
        note: "Drag and align words in alphabetical dictionary order.",
      };
    },
  });

  return (
    <PlayShell
      title="Dictionary Conveyor"
      mission="Arrange the words into correct alphabetical dictionary order."
      icon={BookOpen}
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
        <Bay label="Alphabetical Conveyor Order">
          <div className="flex flex-wrap gap-2 justify-center py-2">
            {world.order.map((word, idx) => (
              <div
                key={word}
                className="p-2.5 sm:p-3 bg-white border-2 border-indigo-200 rounded-xl shadow-sm text-center min-w-[90px]"
              >
                <span className="text-[10px] font-mono text-slate-500 block mb-1">
                  Position #{idx + 1}
                </span>
                <span className="font-bold text-sm text-slate-800">{word}</span>
              </div>
            ))}
          </div>
        </Bay>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q14 — 👨‍👩‍👧 Family Detective
   ══════════════════════════════════════════════════════════════════════ */
interface Q14World {
  derivedRelationship: string;
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
    initial: { derivedRelationship: "Aunt / Sister-in-law" },
    derive: (w) => {
      return {
        value: "Option D",
        optionId: matchText(question, "D") ?? "D",
      };
    },
  });

  return (
    <PlayShell
      title="Family Detective"
      mission="Connect the genealogical graph and trace the relationship between Amar and the girl's mother."
      icon={Users}
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
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-800 p-4 rounded-xl border border-indigo-100 flex flex-col items-center shadow-inner">
          <svg viewBox="0 0 280 140" className="w-full max-w-sm h-36 bg-white/60 rounded-lg border border-slate-200">
            <circle cx="60" cy="90" r="18" fill="#3b82f6" />
            <text x="60" y="94" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">Amar</text>

            <circle cx="60" cy="30" r="18" fill="#6366f1" />
            <text x="60" y="34" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">Father</text>

            <circle cx="200" cy="30" r="18" fill="#ec4899" />
            <text x="200" y="34" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">Mother</text>

            <circle cx="200" cy="90" r="18" fill="#f43f5e" />
            <text x="200" y="94" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">Girl</text>

            <line x1="60" y1="48" x2="60" y2="72" stroke="#94a3b8" strokeWidth="2" />
            <line x1="200" y1="48" x2="200" y2="72" stroke="#94a3b8" strokeWidth="2" />
            <line x1="78" y1="30" x2="182" y2="30" stroke="#facc15" strokeWidth="2.5" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q15 — 🧩 Matrix Laboratory
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
      if (w.selectedCell === "C") {
        return {
          value: "Figure C (Completes Row/Column Logic)",
          optionId: matchText(question, "C") ?? "C",
        };
      }
      return {
        value: `Figure ${w.selectedCell}`,
        note: "Inspect the shaded quadrants across rows and columns.",
      };
    },
  });

  return (
    <PlayShell
      title="Figure Matrix Laboratory"
      mission="Analyze row and column transformations to construct the missing 9th cell."
      icon={Grid}
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
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 p-4 rounded-xl flex justify-center shadow-inner">
          <div className="grid grid-cols-3 gap-2 max-w-xs w-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-white/60 rounded-lg border border-indigo-200 p-2 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-8 h-8">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                  <path
                    d={`M 20 20 L 20 4 A 16 16 0 0 1 ${i % 2 === 0 ? "36 20" : "20 36"} Z`}
                    fill="#818cf8"
                  />
                </svg>
              </div>
            ))}
            <div className="aspect-square bg-indigo-100/80 border-2 border-indigo-400 rounded-lg p-2 flex items-center justify-center shadow-lg">
              <span className="font-mono text-xs font-bold text-amber-600 animate-pulse">
                Cell {world.selectedCell}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {(["A", "B", "C", "D"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => set({ selectedCell: opt })}
              className={`p-2.5 rounded-xl border-2 font-bold text-xs transition-all ${
                world.selectedCell === opt
                  ? opt === "C"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md"
                    : "bg-indigo-50 border-indigo-400 text-indigo-900"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Option {opt} {opt === "C" && "✓"}
            </button>
          ))}
        </div>
      </div>
    </PlayShell>
  );
}

"use client";

import React, { useState } from "react";
import { FlaskConical, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";

interface TestingLabActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function TestingLabActivity({
  value,
  onChange,
  readOnly = false,
}: TestingLabActivityProps) {
  // Statements:
  // (i) 705830 is divisible by both 2 and 5 => T (ends in 0)
  // (ii) Number of common prime factors of 150 & 275 is 5 => F (only 1 common prime factor, which is 5)
  // (iii) If 2579x is divisible by 8, then x can be 2 => T (792 ÷ 8 = 99)
  // (iv) If a number is prime, then it is always odd => F (2 is an even prime)
  // Correct sequence: T, F, T, F (Option D)

  const [selectedSequence, setSelectedSequence] = useState<string>(
    value ? String(value) : ""
  );

  const [toggles, setToggles] = useState<{ [key: string]: "T" | "F" }>({
    i: "T",
    ii: "F",
    iii: "T",
    iv: "F",
  });

  const options = [
    { id: "A", val: "T, T, F, F", label: "T, T, F, F" },
    { id: "B", val: "F, F, T, T", label: "F, F, T, T" },
    { id: "C", val: "F, T, F, T", label: "F, T, F, T" },
    { id: "D", val: "T, F, T, F", label: "T, F, T, F" },
  ];

  const handleToggle = (key: string, val: "T" | "F") => {
    if (readOnly) return;
    const next = { ...toggles, [key]: val };
    setToggles(next);
    const seqStr = `${next.i}, ${next.ii}, ${next.iii}, ${next.iv}`;
    setSelectedSequence(seqStr);
    // Find matching option
    const matched = options.find((o) => o.val === seqStr);
    if (matched) {
      onChange(matched.id);
    } else {
      onChange(seqStr);
    }
  };

  const handleOptionSelect = (opt: typeof options[0]) => {
    if (readOnly) return;
    setSelectedSequence(opt.val);
    const parts = opt.val.split(", ").map((s) => s.trim() as "T" | "F");
    setToggles({ i: parts[0], ii: parts[1], iii: parts[2], iv: parts[3] });
    onChange(opt.id);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 border border-cyan-400/40 rounded-lg text-cyan-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-cyan-300 flex items-center gap-2">
              Divisibility & Prime Testing Station (Q49) <Sparkles className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Run mathematical tests on all 4 hypotheses to synthesize the boolean sequence.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Laboratory Hypotheses */}
      <div className="space-y-3">
        {[
          {
            key: "i",
            title: "(i) 705830 is divisible by both 2 and 5",
            proof: "Ends in 0 → Divisible by 10 → Divisible by both 2 & 5",
            expected: "T",
          },
          {
            key: "ii",
            title: "(ii) Number of common prime factors of 150 & 275 is 5",
            proof: "150 = 2×3×5² ; 275 = 5²×11 → Common prime factor is {5}. Count = 1 (NOT 5!)",
            expected: "F",
          },
          {
            key: "iii",
            title: "(iii) If 2579x is divisible by 8, then x can be 2",
            proof: "Test last 3 digits: 792 ÷ 8 = 99 (Exact whole number!)",
            expected: "T",
          },
          {
            key: "iv",
            title: "(iv) If a number is prime, then it is always odd",
            proof: "Counterexample: Number 2 is an EVEN prime number",
            expected: "F",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="font-semibold text-sm text-slate-200">{item.title}</div>
              <div className="text-xs font-mono text-cyan-400/90">{item.proof}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                disabled={readOnly}
                onClick={() => handleToggle(item.key, "T")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  toggles[item.key] === "T"
                    ? "bg-emerald-500/30 text-emerald-300 border-emerald-400 shadow"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                T (True)
              </button>
              <button
                type="button"
                disabled={readOnly}
                onClick={() => handleToggle(item.key, "F")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  toggles[item.key] === "F"
                    ? "bg-rose-500/30 text-rose-300 border-rose-400 shadow"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                F (False)
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Synthesized Sequence:</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedSequence === opt.val || selectedSequence === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleOptionSelect(opt)}
                className={`p-4 rounded-xl border-2 font-mono font-bold transition-all text-center flex flex-col items-center justify-center gap-2 ${
                  isSelected
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/20 scale-[1.02]"
                    : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <span className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-xs text-cyan-400 border border-slate-700">
                  {opt.id}
                </span>
                <span className="text-base">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

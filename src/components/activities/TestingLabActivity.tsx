"use client";

import React, { useState } from "react";
import { FlaskConical, CheckCircle2 } from "lucide-react";

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
  // Question 49:
  // (i) 705830 is divisible by both 2 and 5 => T (ends in 0)
  // (ii) Number of common prime factors of 150 & 275 is 5 => F (only 1 common prime factor, which is 5)
  // (iii) If 2579x is divisible by 8, then x can be 2 => T (792 ÷ 8 = 99)
  // (iv) If a number is prime, then it is always odd => F (2 is an even prime)
  // Synthesized sequence: T, F, T, F (Option D)

  const options = [
    { id: "A", val: "T, T, F, F", label: "T, T, F, F" },
    { id: "B", val: "F, F, T, T", label: "F, F, T, T" },
    { id: "C", val: "F, T, F, T", label: "F, T, F, T" },
    { id: "D", val: "T, F, T, F", label: "T, F, T, F", isCorrect: true },
  ];

  const getInitial = () => {
    if (!value) return "D";
    const str = String(value).trim();
    const found = options.find((o) => o.id === str || o.val === str);
    return found ? found.id : "D";
  };

  const [selectedId, setSelectedId] = useState<string>(getInitial());
  const [toggles, setToggles] = useState<{ [key: string]: "T" | "F" }>({
    i: "T",
    ii: "F",
    iii: "T",
    iv: "F",
  });

  const handleToggle = (key: string, val: "T" | "F") => {
    if (readOnly) return;
    const next = { ...toggles, [key]: val };
    setToggles(next);
    const seqStr = `${next.i}, ${next.ii}, ${next.iii}, ${next.iv}`;
    const matched = options.find((o) => o.val === seqStr);
    if (matched) {
      setSelectedId(matched.id);
      onChange(matched.id);
    } else {
      onChange(seqStr);
    }
  };

  const handleSelectOption = (opt: typeof options[0]) => {
    if (readOnly) return;
    setSelectedId(opt.id);
    const parts = opt.val.split(", ").map((s) => s.trim() as "T" | "F");
    setToggles({ i: parts[0], ii: parts[1], iii: parts[2], iv: parts[3] });
    onChange(opt.id);
  };

  const activeOpt = options.find((o) => o.id === selectedId) || options[3];

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-700">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Divisibility & Prime Logic Diodes (Q49)
            </h3>
            <p className="text-xs text-slate-600">
              Achievers Section: Test all 4 mathematical hypotheses to synthesize the boolean sequence.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-cyan-50 text-cyan-900 px-3 py-1.5 rounded-lg border border-cyan-300">
          Synthesized: <span className="text-cyan-700 font-black">{activeOpt.val}</span>
        </div>
      </div>

      {/* 4 Laboratory Hypotheses */}
      <div className="space-y-2.5">
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
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div className="space-y-0.5">
              <div className="font-semibold text-xs text-slate-800">{item.title}</div>
              <div className="text-[11px] font-mono text-cyan-800">{item.proof}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                disabled={readOnly}
                onClick={() => handleToggle(item.key, "T")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  toggles[item.key] === "T"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
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
                    ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
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
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Synthesized Boolean Sequence:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelectOption(opt)}
                className={`p-3.5 rounded-xl border-2 font-mono font-bold transition-all text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-cyan-50 border-cyan-600 text-cyan-950 shadow-sm ring-1 ring-cyan-400"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs text-slate-700">
                    {opt.id}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <span className="text-base font-black">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

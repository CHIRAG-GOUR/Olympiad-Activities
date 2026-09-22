"use client";

import React, { useState } from "react";
import { Search, ShieldAlert, CheckCircle2, XCircle, Sparkles, Scale } from "lucide-react";

interface EvidenceRoomActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function EvidenceRoomActivity({
  value,
  onChange,
  readOnly = false,
}: EvidenceRoomActivityProps) {
  // Statement-I: In the word CREATIVE, the fraction of vowels plus alphabets made of straight lines evaluates to 4/8.
  // Letters: C, R, E, A, T, I, V, E (Total = 8)
  // Vowels: E, A, I, E = 4/8 (or Straight lines: E, A, T, I, V, E)
  // Statement-II: If 7/9 = p/729 = q/135, then p = 81, q = 105, and p + q = 186.
  // Solving: p = (7 * 729)/9 = 7 * 81 = 567 (NOT 81!). Thus Statement-II is FALSE.
  // Correct Option: Statement-I is true but Statement-II is false (Option C)

  const [selectedOption, setSelectedOption] = useState<string>(
    value ? String(value) : ""
  );

  const [st1Tested, setSt1Tested] = useState<boolean>(true);
  const [st2Tested, setSt2Tested] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"st1" | "st2">("st1");

  const options = [
    { id: "A", label: "Both Statement-I and Statement-II are true." },
    { id: "B", label: "Both Statement-I and Statement-II are false." },
    { id: "C", label: "Statement-I is true but Statement-II is false." },
    { id: "D", label: "Statement-I is false but Statement-II is true." },
  ];

  const handleSelect = (optId: string) => {
    if (readOnly) return;
    setSelectedOption(optId);
    onChange(optId);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-lg text-amber-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-amber-300 flex items-center gap-2">
              Mathematical Truth Evidence Chamber (Q48) <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Conduct forensic mathematical verification on both statements to establish the ultimate verdict.
            </p>
          </div>
        </div>
      </div>

      {/* Verification Station Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("st1")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "st1"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Search className="w-4 h-4" /> Statement I Evidence
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">TRUE</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("st2")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "st2"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Statement II Evidence
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">FALSE</span>
        </button>
      </div>

      {/* Lab Workstation */}
      {activeTab === "st1" ? (
        <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase">Statement I Analysis</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verdict: TRUE (Verified)
            </div>
          </div>
          <p className="text-sm text-slate-300">
            Word: <strong className="text-white font-mono tracking-widest bg-slate-800 px-2 py-0.5 rounded">C R E A T I V E</strong> (8 letters)
          </p>
          <div className="grid grid-cols-8 gap-2 text-center font-mono">
            {[
              { letter: "C", vowel: false, straight: false },
              { letter: "R", vowel: false, straight: false },
              { letter: "E", vowel: true, straight: true },
              { letter: "A", vowel: true, straight: true },
              { letter: "T", vowel: false, straight: true },
              { letter: "I", vowel: true, straight: true },
              { letter: "V", vowel: false, straight: true },
              { letter: "E", vowel: true, straight: true },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg border text-sm font-bold ${
                  item.vowel
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                    : "bg-slate-900 border-slate-700 text-slate-400"
                }`}
              >
                <div className="text-lg">{item.letter}</div>
                <div className="text-[10px] text-slate-400">{item.vowel ? "Vowel" : "Cons."}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-400 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            Vowels = E, A, I, E (Count = 4). Fraction of vowels = <span className="text-emerald-400 font-bold">4 / 8</span>. Statement I is <span className="text-emerald-300 font-bold">TRUE</span>.
          </div>
        </div>
      ) : (
        <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase">Statement II Ratio Calculation</span>
            <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-500/30">
              <XCircle className="w-3.5 h-3.5" /> Verdict: FALSE (Calculation Mismatch)
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs text-slate-400 font-mono">Statement claims:</div>
              <div className="text-sm font-mono text-rose-300">p = 81, q = 105, p + q = 186</div>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs text-slate-400 font-mono">Actual Mathematics:</div>
              <div className="text-sm font-mono text-emerald-300">
                7/9 = p/729 &rArr; p = 7 &times; 81 = <strong className="text-amber-300">567</strong> &ne; 81
              </div>
            </div>
          </div>
          <div className="text-xs text-rose-300 bg-rose-950/40 p-3 rounded-lg border border-rose-500/30">
            Since <span className="font-mono font-bold">p = 567</span> (not 81), Statement II is factually and mathematically <span className="font-bold underline">FALSE</span>.
          </div>
        </div>
      )}

      {/* Answer Selection Grid */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Final Verified Finding:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id || selectedOption === opt.label;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.id)}
                className={`p-4 rounded-xl border-2 font-medium transition-all text-left flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20 scale-[1.01]"
                    : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-amber-400 border border-slate-700">
                    {opt.id}
                  </span>
                  <span className="text-sm">{opt.label}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Search, ShieldAlert, CheckCircle2, XCircle, Scale, ShieldCheck } from "lucide-react";

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
  // Question 48:
  // Statement-I: In the word CREATIVE, the fraction of vowels plus alphabets made of straight lines evaluates to 4/8. (TRUE)
  // Statement-II: If 7/9 = p/729 = q/135, then p = 81, q = 105, and p + q = 186.
  // Solving: p = (7 * 729)/9 = 7 * 81 = 567 (NOT 81!). Thus Statement-II is FALSE.
  // Correct Option: Statement-I is true but Statement-II is false (Option C)

  const options = [
    { id: "A", label: "Both Statement-I and Statement-II are true.", isCorrect: false },
    { id: "B", label: "Both Statement-I and Statement-II are false.", isCorrect: false },
    { id: "C", label: "Statement-I is true but Statement-II is false.", isCorrect: true },
    { id: "D", label: "Statement-I is false but Statement-II is true.", isCorrect: false },
  ];

  const getInitial = () => {
    if (!value) return "C";
    const str = String(value).trim();
    const found = options.find((o) => o.id === str || o.label === str);
    return found ? found.id : "C";
  };

  const [selectedId, setSelectedId] = useState<string>(getInitial());
  const [activeTab, setActiveTab] = useState<"st1" | "st2">("st1");

  const handleSelect = (optId: string) => {
    if (readOnly) return;
    setSelectedId(optId);
    onChange(optId);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Mathematical Truth Evidence Chamber (Q48)
            </h3>
            <p className="text-xs text-slate-600">
              Conduct forensic mathematical verification on both statements to establish the ultimate verified verdict.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300">
          Verdict: <span className="text-emerald-700 font-black">Option C (St-I TRUE, St-II FALSE)</span>
        </div>
      </div>

      {/* Verification Station Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("st1")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "st1"
              ? "bg-amber-100 text-amber-900 border border-amber-300 shadow-sm"
              : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          <Search className="w-4 h-4 text-amber-700" /> Statement I Evidence
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-black">
            TRUE
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("st2")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "st2"
              ? "bg-amber-100 text-amber-900 border border-amber-300 shadow-sm"
              : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-700" /> Statement II Evidence
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 font-black">
            FALSE
          </span>
        </button>
      </div>

      {/* Forensic Proof Inspection Box */}
      {activeTab === "st1" ? (
        <div
          onClick={() => handleSelect("C")}
          className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-3 cursor-pointer hover:border-amber-400 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-900 font-bold uppercase">Statement I Proof</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verdict: TRUE (Verified)
            </div>
          </div>
          <p className="text-xs text-slate-700">
            Word: <strong className="text-slate-900 font-mono tracking-widest bg-white border border-slate-200 px-2 py-0.5 rounded">C R E A T I V E</strong> (8 letters)
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center font-mono">
            {[
              { letter: "C", vowel: false },
              { letter: "R", vowel: false },
              { letter: "E", vowel: true },
              { letter: "A", vowel: true },
              { letter: "T", vowel: false },
              { letter: "I", vowel: true },
              { letter: "V", vowel: false },
              { letter: "E", vowel: true },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg border text-sm font-bold ${
                  item.vowel
                    ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                    : "bg-white border-slate-200 text-slate-500"
                }`}
              >
                <div className="text-lg">{item.letter}</div>
                <div className="text-[10px]">{item.vowel ? "Vowel" : "Cons."}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
            Vowels = E, A, I, E (Count = 4). Fraction of vowels = <span className="text-emerald-700 font-bold font-mono">4 / 8</span>. Statement I is <span className="text-emerald-700 font-bold">TRUE</span>.
          </div>
        </div>
      ) : (
        <div
          onClick={() => handleSelect("C")}
          className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-3 cursor-pointer hover:border-amber-400 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-900 font-bold uppercase">Statement II Ratio Calculation</span>
            <div className="flex items-center gap-1.5 text-xs text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-300 font-bold">
              <XCircle className="w-3.5 h-3.5 text-rose-600" /> Verdict: FALSE (Calculation Mismatch)
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="text-[11px] text-slate-500 font-mono">Statement claims:</div>
              <div className="text-sm font-mono text-rose-700 font-bold">p = 81, q = 105, p + q = 186</div>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="text-[11px] text-slate-500 font-mono">Actual Mathematics:</div>
              <div className="text-sm font-mono text-emerald-700 font-bold">
                7/9 = p/729 &rArr; p = 7 &times; 81 = <span className="text-amber-800 font-black">567</span> &ne; 81
              </div>
            </div>
          </div>
          <div className="text-xs text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
            Since <span className="font-mono font-bold">p = 567</span> (not 81), Statement II is factually and mathematically <span className="font-bold underline">FALSE</span>.
          </div>
        </div>
      )}

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Verified Statement Finding:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.id)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-amber-50 border-amber-600 text-amber-950 shadow-sm ring-1 ring-amber-400"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700 shrink-0">
                    {opt.id}
                  </span>
                  <div className="text-xs font-bold">{opt.label}</div>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

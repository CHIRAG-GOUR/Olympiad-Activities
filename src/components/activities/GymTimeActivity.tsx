"use client";

import React, { useState } from "react";
import { Timer, CheckCircle2, Clock, ArrowRight } from "lucide-react";

interface GymTimeActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function GymTimeActivity({
  value,
  onChange,
  readOnly = false,
}: GymTimeActivityProps) {
  // Question 41: Puneet began exercising at 18:25 hours and finished at 19:52 hours.
  // Duration: 19:52 − 18:25 = 1 hour 27 minutes = 87 minutes (Option B)

  const options = [
    { id: "A", val: "1 hour 33 minutes", num: 93, label: "1 hour 33 minutes", desc: "Borrowing error in minute subtraction" },
    { id: "B", val: "1 hour 27 minutes (87 min)", num: 87, label: "1 hour 27 minutes (87 min)", desc: "19:52 − 18:25 = 1 hr 27 min = 87 mins", isCorrect: true },
    { id: "C", val: "72 minutes", num: 72, label: "72 minutes", desc: "Missing full 15 minutes" },
    { id: "D", val: "Both B and C", num: 0, label: "Both B and C", desc: "Inconsistent durations" },
  ];

  const getInitial = () => {
    if (!value) return "B";
    const str = String(value).trim();
    const found = options.find((o) => o.id === str || o.val === str || String(o.num) === str);
    return found ? found.id : "B";
  };

  const [selectedId, setSelectedId] = useState<string>(getInitial());
  const activeOpt = options.find((o) => o.id === selectedId) || options[1];

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
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Gym Workout Chronometer (Q41)
            </h3>
            <p className="text-xs text-slate-600">
              Compute elapsed exercise duration from <strong className="text-slate-900 font-mono">18:25</strong> to <strong className="text-slate-900 font-mono">19:52</strong> in hours and minutes.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300">
          Elapsed Time: <span className="text-amber-700 font-black">{activeOpt.val}</span>
        </div>
      </div>

      {/* Chronometer Dual Clock Time Flow */}
      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-around gap-3">
        {/* Start Clock: 18:25 */}
        <div
          onClick={() => handleSelect("B")}
          className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center text-center space-y-1 cursor-pointer hover:border-amber-400 transition-all shadow-sm w-full sm:w-auto"
        >
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-500">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>SESSION START</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">18:25</div>
          <span className="text-[10px] text-slate-400 font-mono">6:25 PM Evening</span>
        </div>

        <ArrowRight className="w-6 h-6 text-slate-400 hidden sm:block" />

        {/* Finish Clock: 19:52 */}
        <div
          onClick={() => handleSelect("B")}
          className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col items-center text-center space-y-1 cursor-pointer hover:border-amber-400 transition-all shadow-sm w-full sm:w-auto"
        >
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-500">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>SESSION FINISH</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">19:52</div>
          <span className="text-[10px] text-slate-400 font-mono">7:52 PM Evening</span>
        </div>

        {/* Elapsed Duration Display */}
        <div
          onClick={() => handleSelect("B")}
          className="p-3.5 bg-amber-50 border-2 border-amber-500 rounded-xl flex flex-col items-center text-center space-y-1 cursor-pointer shadow-md w-full sm:w-auto"
        >
          <div className="text-xs font-mono font-bold text-amber-900 uppercase">
            CALCULATED DURATION
          </div>
          <div className="text-2xl font-black text-amber-950 font-mono">1 hr 27 min</div>
          <div className="text-[11px] text-emerald-700 font-mono font-bold">
            60 min + 27 min = 87 minutes
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Select Verified Elapsed Duration:
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
                  <div>
                    <div className="text-sm font-black font-mono">{opt.val}</div>
                    <div className="text-[11px] text-slate-500 font-sans font-normal mt-0.5">{opt.desc}</div>
                  </div>
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

"use client";

import React, { useState, useEffect } from "react";
import { Question } from "@/types/question";
import { Calculator, Delete, RotateCcw } from "lucide-react";

interface NumericQuestionProps {
  question: Question;
  value?: number | string;
  onChange: (val: number | string) => void;
  readOnly?: boolean;
}

export function NumericQuestion({ question, value, onChange, readOnly = false }: NumericQuestionProps) {
  const config = question.numericConfig;
  const [inputVal, setInputVal] = useState<string>(value !== undefined && value !== null ? String(value) : "");

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setInputVal(String(value));
    }
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const v = e.target.value;
    setInputVal(v);
    const num = parseFloat(v);
    onChange(isNaN(num) ? v : num);
  };

  const appendKey = (char: string) => {
    if (readOnly) return;
    if (char === "." && inputVal.includes(".")) return;
    const nextVal = inputVal + char;
    setInputVal(nextVal);
    const num = parseFloat(nextVal);
    onChange(isNaN(num) ? nextVal : num);
  };

  const handleBackspace = () => {
    if (readOnly) return;
    const nextVal = inputVal.slice(0, -1);
    setInputVal(nextVal);
    const num = parseFloat(nextVal);
    onChange(nextVal === "" ? "" : isNaN(num) ? nextVal : num);
  };

  const handleClear = () => {
    if (readOnly) return;
    setInputVal("");
    onChange("");
  };

  const keypadButtons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "-"];

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="bg-[#FFFDF5] p-8 rounded-2xl border-2 border-[#FDE68A] shadow-md flex flex-col items-center gap-6">
        <div className="w-full text-center space-y-3">
          <label className="text-[13px] font-extrabold uppercase tracking-wider text-[#92400E] block">
            Enter Exact Calculated Value
          </label>
          <div className="flex items-center justify-center gap-3">
            {config?.prefix && (
              <span className="text-2xl font-extrabold text-slate-900">{config.prefix}</span>
            )}
            <input
              type="text"
              inputMode="decimal"
              value={inputVal}
              onChange={handleTextChange}
              disabled={readOnly}
              placeholder="0.00"
              className="w-56 h-[56px] text-center text-3xl font-mono font-extrabold text-slate-900 px-4 bg-white border-2 border-[#F59E0B] rounded-xl shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FEF08A]"
            />
            {config?.unit && (
              <span className="h-[56px] text-lg font-extrabold text-[#92400E] bg-[#FEF3C7] px-4 border-2 border-[#FDE68A] rounded-xl flex items-center font-mono">
                {config.unit}
              </span>
            )}
          </div>
        </div>

        {/* On-screen interactive Keypad */}
        {config?.showKeypad !== false && !readOnly && (
          <div className="w-full max-w-sm pt-4 border-t-2 border-[#FDE68A]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-extrabold text-[#92400E] flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#D97706]" /> Quick Keypad
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="h-[36px] px-3 bg-white border-2 border-[#FDE68A] hover:bg-[#FEF3C7] rounded-xl text-[13px] font-extrabold text-slate-800 flex items-center gap-1 shadow-subtle"
                >
                  <Delete className="w-4 h-4 text-[#D97706]" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="h-[36px] px-3 bg-white border-2 border-[#FDE68A] hover:bg-rose-50 hover:text-rose-600 rounded-xl text-[13px] font-extrabold text-slate-700 flex items-center gap-1 shadow-subtle"
                >
                  <RotateCcw className="w-4 h-4" /> Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {keypadButtons.map((btn) => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => appendKey(btn)}
                  className="h-[52px] bg-white border-2 border-[#FDE68A] hover:border-[#F59E0B] hover:bg-[#FEF3C7] active:bg-[#F59E0B] active:text-slate-950 rounded-xl font-mono font-extrabold text-xl text-slate-900 transition-all shadow-subtle"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {config?.tolerance !== undefined && config.tolerance > 0 && (
        <div className="text-[13px] text-center text-slate-500 font-medium">
          Tolerance interval accepted: ±{config.tolerance} {config.unit || ""}
        </div>
      )}
    </div>
  );
}

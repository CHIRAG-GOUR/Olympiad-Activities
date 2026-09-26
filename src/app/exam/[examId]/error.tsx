"use client";

import React, { useEffect } from "react";
import { ShieldAlert, RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ExamErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ExamError] Uncaught error inside examination session:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4 select-none font-sans">
      <div className="bg-white rounded-2xl border-2 border-[#2468B2] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900">Examination Session Safeguard</h2>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Your progress is preserved in local recovery storage. You can instantly restore and resume your examination without data loss.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 h-11 px-5 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Resume Examination</span>
          </button>

          <Link
            href="/student/exams"
            className="flex-1 h-11 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

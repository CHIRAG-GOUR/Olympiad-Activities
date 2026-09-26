"use client";

import React, { useEffect } from "react";
import { ShieldAlert, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AppError] Global uncaught application exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="bg-white rounded-2xl border-2 border-slate-300 max-w-md w-full p-6 sm:p-8 shadow-xl space-y-5 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-900">Application Error</h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            An unexpected error occurred. You can retry the current view or return to your portal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 h-10 px-4 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/student/dashboard"
            className="flex-1 h-10 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Portal Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { AmbientField } from "@/components/ui/AmbientField";

/**
 * Neutral hold shown while the session is being resolved or a redirect is in flight.
 * Deliberately shows no dashboard chrome and no login form — either would be a flash of
 * the wrong screen.
 */
export function AppLoading({ label = "Preparing your examination centre" }: { label?: string }) {
  return (
    <div className="min-h-dvh flex items-center justify-center font-sans text-[#182338]">
      <AmbientField />
      <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
        <span className="relative w-11 h-11 grid place-items-center">
          <span className="absolute inset-0 rounded-xl bg-[#2468B2] opacity-90" />
          <span className="relative font-display font-bold text-lg text-white">Ω</span>
        </span>
        <span className="flex items-center gap-2 text-[13px] text-[#667085]">
          <span
            className="w-3.5 h-3.5 rounded-full border-2 border-[#C3D8EC] border-t-[#2468B2] motion-safe:animate-spin"
            aria-hidden
          />
          {label}
        </span>
      </div>
    </div>
  );
}

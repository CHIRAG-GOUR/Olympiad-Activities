"use client";

import React from "react";
import Link from "next/link";
import { AmbientField } from "@/components/ui/AmbientField";
import { ShieldAlert, ArrowLeft } from "lucide-react";

/**
 * Shown when a signed-in person reaches an area outside their entitlement.
 * Deliberately plain language — no status codes, no internal reasons.
 */
export function AccessRestricted({ homeHref }: { homeHref: string }) {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6 font-sans text-[#182338]">
      <AmbientField />

      <div className="w-full max-w-[440px] text-center bg-white/72 backdrop-blur-sm border border-white/80 rounded-2xl shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_14px_40px_-16px_rgba(38,45,90,0.22)] p-8 animate-panel-in">
        <span className="w-12 h-12 mx-auto rounded-xl bg-[#F29A38]/15 text-[#B4701F] grid place-items-center">
          <ShieldAlert className="w-6 h-6" strokeWidth={2.1} />
        </span>

        <h1 className="mt-5 text-[20px] font-bold tracking-[-0.01em]">Access restricted</h1>
        <p className="mt-2 text-[13.5px] text-[#667085] leading-relaxed">
          You do not have permission to view this area of the examination centre.
        </p>

        <Link
          href={homeHref}
          className="mt-6 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#2468B2] text-white text-[13.5px] font-semibold hover:bg-[#1C5190] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.2} />
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}

"use client";

import React from "react";

/**
 * Ambient field behind the application window.
 *
 * A light lavender/violet wash with soft colour blooms and a fine grain, plus faint
 * Olympiad construction geometry. It sits fixed behind everything so the shell reads as a
 * window floating above a lit surface rather than a page painted flat white.
 *
 * Deliberately low-contrast: this is atmosphere, never content. Everything here is
 * decorative and hidden from assistive technology.
 */
export function AmbientField() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {/* Base wash — light violet through to a cool blue-grey */}
      <div className="absolute inset-0 bg-[linear-gradient(140deg,#F2F0FC_0%,#F1F5FD_38%,#EFF3FC_62%,#F7F3FB_100%)]" />

      {/* Colour blooms. Large, very soft, low opacity — no neon, no hard edges. */}
      <div className="absolute -top-[18%] -left-[10%] w-[46rem] h-[46rem] rounded-full bg-[#8067D9]/[0.14] blur-[120px]" />
      <div className="absolute -top-[12%] right-[-8%] w-[40rem] h-[40rem] rounded-full bg-[#59B6DE]/[0.16] blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[22%] w-[44rem] h-[44rem] rounded-full bg-[#2468B2]/[0.10] blur-[130px]" />
      <div className="absolute bottom-[6%] right-[4%] w-[26rem] h-[26rem] rounded-full bg-[#F4C542]/[0.12] blur-[110px]" />

      {/* Olympiad construction geometry — orbits and a coordinate grid, barely there */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <pattern id="ambient-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0 H0 V48" stroke="#2468B2" strokeOpacity="0.05" strokeWidth="1" fill="none" />
          </pattern>
        </defs>
        <rect width="1600" height="900" fill="url(#ambient-grid)" />
        <circle cx="1320" cy="150" r="230" stroke="#8067D9" strokeOpacity="0.10" strokeWidth="1.5" />
        <ellipse
          cx="1320"
          cy="150"
          rx="230"
          ry="86"
          stroke="#2468B2"
          strokeOpacity="0.09"
          strokeWidth="1.5"
          transform="rotate(-24 1320 150)"
        />
        <circle cx="210" cy="760" r="180" stroke="#59B6DE" strokeOpacity="0.11" strokeWidth="1.5" />
        <path
          d="M0 640 L300 470 L560 560 L900 330"
          stroke="#8067D9"
          strokeOpacity="0.08"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Fine grain so the wash has a surface instead of banding */}
      <div
        className="absolute inset-0 opacity-[0.32] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}

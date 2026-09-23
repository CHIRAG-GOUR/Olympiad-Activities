"use client";

import React from "react";

/**
 * Olympiad discovery lamp.
 *
 * A drawn laboratory bulb whose filament is shaped from a compass arc and a plotted
 * curve — the idea being insight rather than a generic lightbulb glyph. It sits dim until
 * the person engages with the sign-in panel, then warms: filament glows, the glass takes a
 * warm cast, and a soft halo opens around it.
 *
 * `lit` is driven by hover on desktop and by focus/tap on touch devices, so the interaction
 * exists without a pointer. All motion is confined to opacity and transform, and is
 * suppressed under prefers-reduced-motion by the caller's stylesheet.
 */
export function OlympiadBulb({ lit, className = "" }: { lit: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 260"
      className={className}
      fill="none"
      role="img"
      aria-label={lit ? "Olympiad lamp, lit" : "Olympiad lamp, unlit"}
    >
      <defs>
        {/* Warm halo that opens when lit */}
        <radialGradient id="bulb-halo" cx="50%" cy="38%" r="50%">
          <stop offset="0%" stopColor="#F4C542" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#F4C542" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#F4C542" stopOpacity="0" />
        </radialGradient>

        {/* Glass body: cool when off, warm when lit */}
        <linearGradient id="glass-off" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#DCE4F2" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="glass-on" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF6DC" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#F8DFA0" stopOpacity="0.88" />
        </linearGradient>

        <linearGradient id="filament-on" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4C542" />
          <stop offset="100%" stopColor="#F29A38" />
        </linearGradient>

        <filter id="filament-blur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Halo */}
      <circle
        cx="100"
        cy="96"
        r="92"
        fill="url(#bulb-halo)"
        className="transition-opacity duration-500 ease-out"
        style={{ opacity: lit ? 1 : 0 }}
      />

      {/* Light spill onto the surrounding construction lines */}
      <g
        className="transition-opacity duration-500 ease-out"
        style={{ opacity: lit ? 0.85 : 0.25 }}
      >
        {[
          "M18 96 H44",
          "M156 96 H182",
          "M34 40 L54 58",
          "M166 40 L146 58",
          "M34 152 L54 134",
          "M166 152 L146 134",
        ].map((d) => (
          <path
            key={d}
            d={d}
            stroke={lit ? "#F4C542" : "#C3D8EC"}
            strokeWidth="2"
            strokeLinecap="round"
            className="transition-[stroke] duration-500"
          />
        ))}
      </g>

      {/* Glass envelope */}
      <path
        d="M100 26 C63 26 36 53 36 89 c0 22 11 38 24 50 8 8 12 15 13 24 h54 c1-9 5-16 13-24 13-12 24-28 24-50 0-36-27-63-64-63 Z"
        fill={lit ? "url(#glass-on)" : "url(#glass-off)"}
        stroke={lit ? "#E3B23C" : "#B9C6DC"}
        strokeWidth="2.5"
        className="transition-all duration-500 ease-out"
      />

      {/* Specular highlight on the glass */}
      <path
        d="M66 62 C70 48 82 40 94 38"
        stroke="#FFFFFF"
        strokeOpacity="0.9"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Filament: a compass arc joined to a plotted curve */}
      <g
        className="transition-opacity duration-500 ease-out"
        style={{ opacity: lit ? 1 : 0 }}
      >
        <path
          d="M78 116 V96 a22 22 0 0 1 44 0 v20"
          stroke="url(#filament-on)"
          strokeWidth="7"
          strokeLinecap="round"
          filter="url(#filament-blur)"
        />
      </g>
      <path
        d="M78 116 V96 a22 22 0 0 1 44 0 v20"
        stroke={lit ? "url(#filament-on)" : "#AEBBD0"}
        strokeWidth="3"
        strokeLinecap="round"
        className="transition-[stroke] duration-500"
      />
      {/* Filament leads */}
      <path
        d="M78 116 v14 M122 116 v14"
        stroke={lit ? "#E3B23C" : "#AEBBD0"}
        strokeWidth="2.5"
        strokeLinecap="round"
        className="transition-[stroke] duration-500"
      />

      {/* Screw cap */}
      <g>
        <path d="M74 163 h52 v10 h-52 Z" fill="#C9D3E4" stroke="#9FAEC6" strokeWidth="2" />
        <path d="M76 175 h48 v9 h-48 Z" fill="#BCC8DC" stroke="#9FAEC6" strokeWidth="2" />
        <path d="M78 186 h44 v9 h-44 Z" fill="#C9D3E4" stroke="#9FAEC6" strokeWidth="2" />
        <path d="M86 197 h28 v8 a6 6 0 0 1-6 6 h-16 a6 6 0 0 1-6-6 Z" fill="#9FAEC6" />
      </g>

      {/* Base plinth with a small measured scale — the laboratory cue */}
      <path d="M62 218 h76 a4 4 0 0 1 4 4 v6 H58 v-6 a4 4 0 0 1 4-4 Z" fill="#E7EDF5" stroke="#C3D8EC" strokeWidth="2" />
      {[72, 86, 100, 114, 128].map((x) => (
        <path key={x} d={`M${x} 222 v4`} stroke="#9FAEC6" strokeWidth="1.6" strokeLinecap="round" />
      ))}
    </svg>
  );
}

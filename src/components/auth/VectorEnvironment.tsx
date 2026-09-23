"use client";

import React from "react";

/**
 * Moving mathematical environment behind the sign-in panel.
 *
 * Orbits rotate, points travel along them, a triangle drifts, a plotted line draws itself
 * and resets, and a coordinate grid shifts by a few pixels. All of it is SVG with CSS/SMIL
 * transforms — no canvas, no WebGL, nothing per-frame in JavaScript.
 *
 * When `engaged` is true (the person is interacting with the sign-in panel) the strokes
 * brighten a little, the orbits speed up slightly, and a few particles drift toward the
 * lamp. Everything is suppressed under prefers-reduced-motion via `motion-safe:`, leaving
 * the composition intact but still.
 */
export function VectorEnvironment({ engaged }: { engaged: boolean }) {
  const stroke = engaged ? "#8067D9" : "#A9B6D4";
  const accent = engaged ? "#F29A38" : "#B9C6DC";
  const opacity = engaged ? 0.9 : 0.55;

  return (
    <svg
      viewBox="0 0 520 620"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      fill="none"
      aria-hidden
    >
      <defs>
        <pattern id="login-grid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M44 0 H0 V44" stroke="#2468B2" strokeOpacity="0.07" strokeWidth="1" fill="none" />
        </pattern>
        <linearGradient id="plot-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2468B2" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#59B6DE" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Coordinate grid, drifting a few pixels */}
      <g className="motion-safe:animate-[grid-shift_26s_ease-in-out_infinite]">
        <rect x="-44" y="-44" width="608" height="708" fill="url(#login-grid)" />
      </g>

      {/* Primary orbit with travelling points */}
      <g
        style={{ transformOrigin: "300px 210px", opacity }}
        className={`transition-opacity duration-500 ${
          engaged
            ? "motion-safe:animate-[orbit_26s_linear_infinite]"
            : "motion-safe:animate-[orbit_44s_linear_infinite]"
        }`}
      >
        <ellipse cx="300" cy="210" rx="170" ry="66" stroke={stroke} strokeWidth="1.6" strokeOpacity="0.7" />
        <circle cx="470" cy="210" r="5" fill={accent} />
        <circle cx="130" cy="210" r="3.5" fill={stroke} />
      </g>

      {/* Secondary orbit, tilted and slower */}
      <g
        style={{ transformOrigin: "300px 210px", opacity: opacity * 0.8 }}
        className={`transition-opacity duration-500 ${
          engaged
            ? "motion-safe:animate-[orbit-reverse_34s_linear_infinite]"
            : "motion-safe:animate-[orbit-reverse_58s_linear_infinite]"
        }`}
      >
        <ellipse
          cx="300"
          cy="210"
          rx="150"
          ry="150"
          stroke={stroke}
          strokeWidth="1.4"
          strokeOpacity="0.45"
          strokeDasharray="6 10"
        />
        <circle cx="300" cy="60" r="4" fill="#59B6DE" />
      </g>

      {/* Drifting triangle */}
      <g
        className="motion-safe:animate-[drift-y_11s_ease-in-out_infinite]"
        style={{ opacity }}
      >
        <path
          d="M86 452 L128 524 L44 524 Z"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
          className="transition-[stroke] duration-500"
        />
        <circle cx="86" cy="452" r="3" fill={accent} />
      </g>

      {/* Square, drifting on a longer cycle */}
      <g className="motion-safe:animate-[drift-y_15s_ease-in-out_infinite_reverse]" style={{ opacity }}>
        <rect
          x="404"
          y="452"
          width="66"
          height="66"
          rx="6"
          stroke={stroke}
          strokeWidth="1.8"
          transform="rotate(14 437 485)"
          className="transition-[stroke] duration-500"
        />
      </g>

      {/* Plotted line that draws itself and resets */}
      <g style={{ opacity: engaged ? 1 : 0.7 }} className="transition-opacity duration-500">
        <path d="M40 392 H480" stroke={stroke} strokeWidth="1.2" strokeOpacity="0.4" />
        <path
          d="M40 392 L130 344 L214 366 L300 300 L386 328 L480 264"
          stroke="url(#plot-line)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1"
          className="motion-safe:animate-[draw-plot_9s_ease-in-out_infinite]"
        />
        <circle cx="300" cy="300" r="4" fill="#2468B2" />
        <circle cx="480" cy="264" r="4.5" fill={accent} />
      </g>

      {/* Compass arc, lower left */}
      <path
        d="M52 236 a96 96 0 0 1 96-96"
        stroke={accent}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="5 7"
        style={{ opacity: opacity * 0.9 }}
        className="transition-[stroke] duration-500"
      />

      {/* Particles that drift toward the lamp while engaged */}
      <g className="transition-opacity duration-700" style={{ opacity: engaged ? 1 : 0 }}>
        {[
          { cx: 120, cy: 150, d: "7s" },
          { cx: 452, cy: 128, d: "9s" },
          { cx: 168, cy: 322, d: "8s" },
          { cx: 420, cy: 336, d: "10s" },
        ].map((p) => (
          <circle
            key={`${p.cx}-${p.cy}`}
            cx={p.cx}
            cy={p.cy}
            r="2.5"
            fill="#F4C542"
            className="motion-safe:animate-[toward-lamp_var(--d)_ease-in-out_infinite]"
            style={{ ["--d" as string]: p.d }}
          />
        ))}
      </g>

      {/* Numerals as quiet texture */}
      <g fill={stroke} fontFamily="ui-monospace, monospace" fontSize="15" style={{ opacity: opacity * 0.5 }}>
        <text x="62" y="120">π</text>
        <text x="446" y="404">Σ</text>
        <text x="96" y="576">√</text>
        <text x="392" y="196">∠</text>
      </g>
    </svg>
  );
}

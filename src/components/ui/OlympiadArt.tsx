"use client";

import React from "react";

/**
 * Olympiad visual language.
 *
 * Every mark here means something: construction lines for geometry, a number line for
 * arithmetic, a folded net for spatial reasoning, a laurel for the achievers section.
 * They are drawn in the platform palette and used sparingly — a motif per section, never
 * scattered decoration.
 */

const INK = "#182338";
const BLUE = "#2468B2";
const SKY = "#59B6DE";
const YELLOW = "#F4C542";
const ORANGE = "#F29A38";
const LAV = "#8067D9";
const LINE = "#C3D8EC";

/* ── Section motifs ───────────────────────────────────────── */

export type MotifKind = "geometry" | "numbers" | "logic" | "achiever" | "everyday";

/** Compact motif used on subject / section cards. */
export function SectionMotif({ kind, className = "" }: { kind: MotifKind; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      {kind === "geometry" && (
        <>
          <path d="M10 50 L32 12 L54 50 Z" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" />
          <path d="M32 12 V50" stroke={LINE} strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M10 50 H54" stroke={LINE} strokeWidth="1.5" />
          <path d="M26 50 a6 6 0 0 1 6-6" stroke={ORANGE} strokeWidth="1.8" />
          <circle cx="32" cy="12" r="2.6" fill={YELLOW} />
          <circle cx="10" cy="50" r="2.2" fill={BLUE} />
          <circle cx="54" cy="50" r="2.2" fill={BLUE} />
        </>
      )}

      {kind === "numbers" && (
        <>
          <path d="M8 40 H56" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
          {[8, 20, 32, 44, 56].map((x) => (
            <path key={x} d={`M${x} 35 V45`} stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
          ))}
          <circle cx="32" cy="40" r="4.5" fill={YELLOW} stroke={INK} strokeWidth="1.4" />
          <path d="M14 22 h12 M20 16 v12" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" />
          <path d="M40 18 h12 M40 25 h12" stroke={SKY} strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {kind === "logic" && (
        <>
          <rect x="9" y="9" width="19" height="19" rx="3" stroke={BLUE} strokeWidth="2" />
          <circle cx="46" cy="18.5" r="9.5" stroke={SKY} strokeWidth="2" />
          <path d="M18.5 36 L28 55 H9 Z" stroke={ORANGE} strokeWidth="2" strokeLinejoin="round" />
          <rect x="36" y="36" width="19" height="19" rx="3" stroke={LAV} strokeWidth="2" strokeDasharray="4 3" />
          <circle cx="45.5" cy="45.5" r="3" fill={YELLOW} />
        </>
      )}

      {kind === "everyday" && (
        <>
          <path d="M12 24 h40 v26 a2 2 0 0 1-2 2 H14 a2 2 0 0 1-2-2 Z" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" />
          <path d="M24 24 v-6 a8 8 0 0 1 16 0 v6" stroke={SKY} strokeWidth="2" strokeLinecap="round" />
          <path d="M20 36 h10" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" />
          <circle cx="42" cy="40" r="5" fill="none" stroke={YELLOW} strokeWidth="2" />
          <path d="M42 37.5 v2.8 l1.8 1.4" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
        </>
      )}

      {kind === "achiever" && (
        <>
          <path d="M22 12 h20 v13 a10 10 0 0 1-20 0 Z" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 15 h-6 a6 6 0 0 0 6 9" stroke={SKY} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M42 15 h6 a6 6 0 0 1-6 9" stroke={SKY} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M32 35 v7 M25 46 h14" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <path d="M32 15.5 l1.9 3.9 4.3.6-3.1 3 .7 4.3-3.8-2-3.8 2 .7-4.3-3.1-3 4.3-.6 Z" fill={YELLOW} />
          <path d="M24 52 h16" stroke={ORANGE} strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/* ── Interaction motifs (previews of what an activity feels like) ── */

export type InteractionKind = "rotate" | "plot" | "arrange" | "simulate" | "construct" | "measure";

/** Small live motif on activity preview cards — gentle, never distracting. */
export function InteractionMotif({
  kind,
  className = "",
  animate = false,
}: {
  kind: InteractionKind;
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg viewBox="0 0 72 56" className={className} fill="none" aria-hidden>
      {kind === "rotate" && (
        <g className={animate ? "origin-center transition-transform duration-700 group-hover:rotate-12" : ""} style={{ transformOrigin: "36px 28px" }}>
          <path d="M22 20 L36 13 L50 20 L36 27 Z" fill="#FFFFFF" stroke={BLUE} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M22 20 v14 l14 7 V27 Z" fill="#EAF2FC" stroke={BLUE} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M50 20 v14 l-14 7 V27 Z" fill="#D9E8F8" stroke={BLUE} strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="29" cy="24" r="1.6" fill={INK} />
          <circle cx="43" cy="31" r="1.6" fill={INK} />
          <circle cx="36" cy="20" r="1.6" fill={ORANGE} />
        </g>
      )}

      {kind === "plot" && (
        <>
          <path d="M14 44 H60 M14 44 V10" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
          {[24, 34, 44, 54].map((x) => (
            <path key={x} d={`M${x} 42 v4`} stroke="#E1E7EF" strokeWidth="1.2" />
          ))}
          <path d="M18 38 L30 28 L42 32 L56 16" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="42" cy="32" r="3.4" fill="#FFFFFF" stroke={ORANGE} strokeWidth="2" className={animate ? "transition-transform duration-500 group-hover:-translate-y-1.5" : ""} />
          <circle cx="56" cy="16" r="2.6" fill={YELLOW} />
        </>
      )}

      {kind === "arrange" && (
        <>
          <rect x="12" y="12" width="14" height="12" rx="2.5" fill="#EAF2FC" stroke={BLUE} strokeWidth="1.8" />
          <rect x="30" y="12" width="14" height="12" rx="2.5" fill="#FFFFFF" stroke={LINE} strokeWidth="1.8" />
          <rect x="48" y="12" width="12" height="12" rx="2.5" fill="#FFFFFF" stroke={LINE} strokeWidth="1.8" />
          <rect
            x="30"
            y="32"
            width="14"
            height="12"
            rx="2.5"
            fill={YELLOW}
            stroke="#B98F1C"
            strokeWidth="1.6"
            className={animate ? "transition-transform duration-500 group-hover:-translate-y-[18px]" : ""}
          />
          <path d="M37 30 v-3" stroke={ORANGE} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 2" />
        </>
      )}

      {kind === "simulate" && (
        <>
          <path d="M12 46 Q34 6 60 26" stroke={LINE} strokeWidth="1.6" strokeDasharray="4 3" strokeLinecap="round" />
          <circle cx="12" cy="46" r="3" fill={BLUE} />
          <g className={animate ? "transition-transform duration-700 group-hover:translate-x-2 group-hover:-translate-y-1" : ""}>
            <path d="M40 22 l7-6 4 5 -7 6 Z" fill="#FFFFFF" stroke={ORANGE} strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M40 22 l-4 5 5 2 2.5-4" fill={YELLOW} stroke="#B98F1C" strokeWidth="1.4" strokeLinejoin="round" />
          </g>
          <circle cx="60" cy="26" r="5" fill="none" stroke={SKY} strokeWidth="1.8" />
          <ellipse cx="60" cy="26" rx="9" ry="3.4" stroke={LAV} strokeWidth="1.4" transform="rotate(-20 60 26)" />
        </>
      )}

      {kind === "construct" && (
        <>
          <path d="M16 44 L36 14" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
          <path d="M36 14 L56 44" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
          <path d="M16 44 H56" stroke={LINE} strokeWidth="1.6" />
          <path d="M26 44 a10 10 0 0 1 4.6-8.4" stroke={ORANGE} strokeWidth="1.8" className={animate ? "transition-opacity duration-500 opacity-70 group-hover:opacity-100" : ""} />
          <circle cx="36" cy="14" r="2.8" fill={YELLOW} stroke={INK} strokeWidth="1.2" />
          <path d="M36 14 v30" stroke={LINE} strokeWidth="1.2" strokeDasharray="3 3" />
        </>
      )}

      {kind === "measure" && (
        <>
          <rect x="10" y="22" width="52" height="14" rx="2.5" fill="#FFFFFF" stroke={BLUE} strokeWidth="1.8" />
          {[18, 26, 34, 42, 50].map((x, i) => (
            <path key={x} d={`M${x} 22 v${i % 2 === 0 ? 7 : 4.5}`} stroke={LINE} strokeWidth="1.5" strokeLinecap="round" />
          ))}
          <path
            d="M34 40 v6"
            stroke={ORANGE}
            strokeWidth="2"
            strokeLinecap="round"
            className={animate ? "transition-transform duration-500 group-hover:translate-x-2" : ""}
          />
          <circle cx="34" cy="48" r="2.6" fill={YELLOW} />
        </>
      )}
    </svg>
  );
}

/* ── Dashboard hero illustration ──────────────────────────── */

/**
 * The examination-centre scene: a paper under a compass arc, a geometric solid, a
 * number line and a small laurel. Drawn flat in the platform palette so it reads as
 * part of the interface rather than stock clip-art.
 */
export function ExamCentreScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} fill="none" aria-hidden>
      {/* orbital construction arcs */}
      <ellipse cx="232" cy="96" rx="76" ry="76" stroke="#E1E7EF" strokeWidth="1.4" />
      <ellipse cx="232" cy="96" rx="76" ry="28" stroke="#E1E7EF" strokeWidth="1.4" transform="rotate(-24 232 96)" />

      {/* examination paper */}
      <g>
        <rect x="34" y="34" width="104" height="132" rx="6" fill="#FFFFFF" stroke="#D5DDE8" strokeWidth="2" />
        <rect x="34" y="34" width="104" height="22" rx="6" fill="#EAF2FC" />
        <path d="M34 56 H138" stroke="#D5DDE8" strokeWidth="1.4" />
        <path d="M48 45 h34" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" />
        {[72, 84, 96, 108].map((y) => (
          <path key={y} d={`M48 ${y} h${y === 108 ? 44 : 76}`} stroke="#E1E7EF" strokeWidth="2.4" strokeLinecap="round" />
        ))}
        {/* marked answers */}
        <circle cx="52" cy="128" r="5" fill="none" stroke={SKY} strokeWidth="1.8" />
        <path d="M49.6 128 l1.8 1.9 3.4-3.8" stroke={"#55B987"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M64 128 h48" stroke="#E1E7EF" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="52" cy="146" r="5" fill="none" stroke="#E1E7EF" strokeWidth="1.8" />
        <path d="M64 146 h36" stroke="#E1E7EF" strokeWidth="2.4" strokeLinecap="round" />
      </g>

      {/* compass over the paper */}
      <g>
        <path d="M150 150 L168 66" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
        <path d="M186 150 L168 66" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
        <circle cx="168" cy="62" r="5" fill={YELLOW} stroke={INK} strokeWidth="1.6" />
        <path d="M150 150 a34 34 0 0 1 36 0" stroke={ORANGE} strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
      </g>

      {/* geometric solid */}
      <g>
        <path d="M212 60 L246 44 L280 60 L246 76 Z" fill="#FFFFFF" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" />
        <path d="M212 60 v32 l34 16 V76 Z" fill="#EAF2FC" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" />
        <path d="M280 60 v32 l-34 16 V76 Z" fill="#D9E8F8" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" />
      </g>

      {/* number line */}
      <g>
        <path d="M196 140 H296" stroke={SKY} strokeWidth="2.4" strokeLinecap="round" />
        {[204, 228, 252, 276].map((x) => (
          <path key={x} d={`M${x} 134 v12`} stroke="#C3D8EC" strokeWidth="2" strokeLinecap="round" />
        ))}
        <circle cx="252" cy="140" r="6" fill={YELLOW} stroke={INK} strokeWidth="1.8" />
      </g>

      {/* small star mark */}
      <path d="M296 30 l2.4 5 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8 Z" fill={YELLOW} />
    </svg>
  );
}

/** Slim laurel/seal used on results headings. */
export function AcademicSeal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden>
      <circle cx="20" cy="20" r="14" stroke={BLUE} strokeWidth="1.6" />
      <circle cx="20" cy="20" r="10.5" stroke="#C3D8EC" strokeWidth="1.2" strokeDasharray="2 3" />
      <path d="M20 13.5 l1.7 3.5 3.8.6-2.8 2.7.7 3.8-3.4-1.8-3.4 1.8.7-3.8-2.8-2.7 3.8-.6 Z" fill={YELLOW} />
    </svg>
  );
}

/* ── Empty-state illustrations ────────────────────────────── */

export type EmptyKind = "results" | "candidates" | "exams" | "chart";

/** Small, subject-relevant drawing so an empty region reads as intentional. */
export function EmptyArt({ kind, className = "" }: { kind: EmptyKind; className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={className} fill="none" aria-hidden>
      {kind === "results" && (
        <>
          <rect x="30" y="14" width="60" height="64" rx="6" fill="#FFFFFF" stroke="#D5DDE8" strokeWidth="2" />
          <path d="M42 32 h36 M42 44 h36 M42 56 h22" stroke="#E1E7EF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="86" cy="62" r="15" fill="#FFFFFF" stroke={BLUE} strokeWidth="2" />
          <path d="M80 62 l4 4 8-9" stroke={LINE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}

      {kind === "candidates" && (
        <>
          <circle cx="40" cy="36" r="11" fill="#FFFFFF" stroke={BLUE} strokeWidth="2" />
          <path d="M22 66 a18 18 0 0 1 36 0" fill="#FFFFFF" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
          <circle cx="76" cy="40" r="9" fill="#FFFFFF" stroke="#D5DDE8" strokeWidth="2" />
          <path d="M62 66 a14 14 0 0 1 28 0" fill="#FFFFFF" stroke="#D5DDE8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="97" cy="24" r="3" fill={YELLOW} />
        </>
      )}

      {kind === "exams" && (
        <>
          <rect x="26" y="16" width="52" height="60" rx="5" fill="#FFFFFF" stroke="#D5DDE8" strokeWidth="2" />
          <path d="M37 33 h30 M37 45 h30 M37 57 h18" stroke="#E1E7EF" strokeWidth="3" strokeLinecap="round" />
          <path d="M84 30 L96 54" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M96 30 L84 54" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="90" cy="26" r="3.4" fill={YELLOW} />
        </>
      )}

      {kind === "chart" && (
        <>
          <path d="M24 70 H100" stroke="#D5DDE8" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 70 V22" stroke="#D5DDE8" strokeWidth="2" strokeLinecap="round" />
          <rect x="36" y="52" width="12" height="18" rx="2.5" fill="#E1E7EF" />
          <rect x="56" y="44" width="12" height="26" rx="2.5" fill="#E1E7EF" />
          <rect x="76" y="58" width="12" height="12" rx="2.5" fill="#E1E7EF" />
          <path d="M34 40 l14-10 14 6 16-14" stroke={LINE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" />
        </>
      )}
    </svg>
  );
}

/**
 * Faint coordinate-grid + orbit wash used behind the hero. Sits under content at low
 * opacity so the hero reads as an Olympiad workspace rather than a plain white box.
 */
export function HeroBackdrop({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      fill="none"
      aria-hidden
    >
      <defs>
        <pattern id="hero-grid" width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M36 0 H0 V36" stroke="#2468B2" strokeOpacity="0.06" strokeWidth="1" fill="none" />
        </pattern>
      </defs>
      <rect width="800" height="300" fill="url(#hero-grid)" />
      <circle cx="690" cy="70" r="120" stroke="#2468B2" strokeOpacity="0.07" strokeWidth="1.5" />
      <ellipse cx="690" cy="70" rx="120" ry="44" stroke="#8067D9" strokeOpacity="0.09" strokeWidth="1.5" transform="rotate(-22 690 70)" />
      <circle cx="120" cy="250" r="86" stroke="#F29A38" strokeOpacity="0.09" strokeWidth="1.5" />
    </svg>
  );
}

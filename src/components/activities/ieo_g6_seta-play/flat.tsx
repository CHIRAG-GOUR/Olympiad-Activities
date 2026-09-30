"use client";

import React from "react";

/* ══════════════════════════════════════════════════════════════════════
   2D illustrated headers for questions where a 3D world adds nothing:
   reading passages, spelling, spot-the-error and word-meaning questions.
   Each is a hand-drawn SVG scene in the paper's light palette.
   ══════════════════════════════════════════════════════════════════════ */

export type FlatKind = "reading" | "spell" | "error" | "meaning";

const PALETTE: Record<FlatKind, [string, string, string]> = {
  reading: ["#FEF3C7", "#FDE68A", "#B45309"],
  spell: ["#E0F2FE", "#BAE6FD", "#0369A1"],
  error: ["#FFE4E6", "#FECDD3", "#BE123C"],
  meaning: ["#EDE9FE", "#DDD6FE", "#6D28D9"],
};

export function FlatScene({ kind, title, caption, word }: { kind: FlatKind; title: string; caption?: string; word?: string }) {
  const [bg1, bg2, ink] = PALETTE[kind];
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-violet-100">
      <svg viewBox="0 0 960 240" className="block h-auto w-full" role="img" aria-label={title}>
        <defs>
          <linearGradient id={`fg-${kind}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={bg1} />
            <stop offset="1" stopColor={bg2} />
          </linearGradient>
          <filter id="fshadow" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.15" />
          </filter>
        </defs>
        <rect width="960" height="240" fill={`url(#fg-${kind})`} />
        {/* soft background shapes */}
        <circle cx="880" cy="30" r="120" fill="#ffffff" opacity="0.35" />
        <circle cx="70" cy="220" r="90" fill="#ffffff" opacity="0.3" />
        <path d="M0 200 C 200 160, 380 230, 560 190 S 860 170, 960 200 L 960 240 L 0 240 Z" fill="#ffffff" opacity="0.45" />

        {kind === "reading" && <Reading ink={ink} />}
        {kind === "spell" && <Spell ink={ink} word={word} />}
        {kind === "error" && <ErrorArt ink={ink} />}
        {kind === "meaning" && <Meaning ink={ink} word={word} />}

        <text x="470" y="96" fontFamily="system-ui, sans-serif" fontSize="34" fontWeight="900" fill="#1e293b">
          {title}
        </text>
        {caption && (
          <text x="470" y="134" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="600" fill={ink}>
            {caption.length > 58 ? `${caption.slice(0, 56)}…` : caption}
          </text>
        )}
      </svg>
    </div>
  );
}

function Reading({ ink }: { ink: string }) {
  return (
    <g filter="url(#fshadow)">
      {/* desk */}
      <rect x="60" y="176" width="360" height="18" rx="6" fill="#B45309" />
      {/* open book */}
      <g transform="translate(90 70)">
        <path d="M150 20 C 110 4, 50 4, 0 18 L 0 118 C 50 104, 110 104, 150 120 Z" fill="#ffffff" stroke={ink} strokeWidth="3" />
        <path d="M150 20 C 190 4, 250 4, 300 18 L 300 118 C 250 104, 190 104, 150 120 Z" fill="#fffbeb" stroke={ink} strokeWidth="3" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <line x1="20" y1={36 + i * 15} x2="130" y2={32 + i * 15} stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
            <line x1="170" y1={32 + i * 15} x2={i === 2 ? 240 : 280} y2={36 + i * 15} stroke={i === 2 ? "#fbbf24" : "#cbd5e1"} strokeWidth={i === 2 ? 9 : 4} strokeLinecap="round" opacity={i === 2 ? 0.85 : 1} />
          </g>
        ))}
        <line x1="150" y1="20" x2="150" y2="120" stroke={ink} strokeWidth="3" />
      </g>
      {/* magnifier */}
      <g transform="translate(330 58) rotate(20)">
        <circle cx="0" cy="0" r="34" fill="#e0f2fe" fillOpacity="0.6" stroke="#334155" strokeWidth="8" />
        <rect x="-6" y="34" width="12" height="52" rx="6" fill="#7c2d12" />
      </g>
      {/* pencil */}
      <g transform="translate(70 160) rotate(-12)">
        <rect width="120" height="14" rx="3" fill="#facc15" />
        <polygon points="120,0 140,7 120,14" fill="#fde68a" />
        <rect x="-10" width="12" height="14" rx="3" fill="#f472b6" />
      </g>
    </g>
  );
}

function Spell({ ink, word }: { ink: string; word?: string }) {
  const letters = (word ?? "ABC").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5).split("");
  return (
    <g filter="url(#fshadow)">
      {letters.map((l, i) => (
        <g key={i} transform={`translate(${70 + i * 72} ${70 + (i % 2) * 22}) rotate(${(i % 2 ? 6 : -5)})`}>
          <rect width="62" height="62" rx="12" fill={["#38bdf8", "#f472b6", "#facc15", "#34d399", "#a78bfa"][i % 5]} />
          <rect x="4" y="4" width="54" height="46" rx="9" fill="#ffffff" opacity="0.25" />
          <text x="31" y="45" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="36" fontWeight="900" fill="#ffffff">
            {l}
          </text>
        </g>
      ))}
      <path d="M80 190 Q 240 150 420 190" stroke={ink} strokeWidth="4" fill="none" strokeDasharray="10 8" strokeLinecap="round" />
      <g transform="translate(420 60)" fill="#fbbf24">
        <path d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" />
      </g>
    </g>
  );
}

function ErrorArt({ ink }: { ink: string }) {
  return (
    <g filter="url(#fshadow)">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={60 + i * 92} y="120" width="84" height="44" rx="10" fill={i === 2 ? "#fecdd3" : "#ffffff"} stroke={i === 2 ? ink : "#cbd5e1"} strokeWidth="3" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={74 + i * 92} y1="142" x2={130 + i * 92} y2="142" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
      ))}
      {/* flag */}
      <g transform="translate(246 40)">
        <rect x="0" y="0" width="6" height="84" rx="3" fill="#475569" />
        <path d="M6 4 L64 18 L6 36 Z" fill={ink} />
      </g>
      {/* magnifier */}
      <g transform="translate(420 80) rotate(25)">
        <circle r="30" fill="#ffe4e6" fillOpacity="0.6" stroke="#334155" strokeWidth="7" />
        <rect x="-5" y="30" width="10" height="44" rx="5" fill="#7c2d12" />
      </g>
    </g>
  );
}

function Meaning({ ink, word }: { ink: string; word?: string }) {
  return (
    <g filter="url(#fshadow)">
      <g transform="translate(60 70)">
        <rect width="170" height="84" rx="16" fill="#ffffff" stroke={ink} strokeWidth="3" />
        <text x="85" y="54" textAnchor="middle" fontFamily="Georgia, serif" fontSize={word && word.length > 9 ? 22 : 28} fontWeight="800" fill="#1e293b">
          {word ?? "word"}
        </text>
      </g>
      <g transform="translate(250 112)">
        <path d="M0 0 H70" stroke={ink} strokeWidth="6" strokeLinecap="round" />
        <path d="M58 -12 L74 0 L58 12" stroke={ink} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(336 70)">
        <rect width="110" height="84" rx="16" fill="#ffffff" stroke={ink} strokeWidth="3" strokeDasharray="10 8" />
        <text x="55" y="58" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="40" fontWeight="900" fill={ink}>
          ?
        </text>
      </g>
    </g>
  );
}

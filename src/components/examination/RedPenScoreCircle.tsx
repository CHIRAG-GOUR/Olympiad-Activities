"use client";

import React from "react";
import { motion } from "framer-motion";

interface RedPenScoreCircleProps {
  scoreObtained: number;
  maxScore: number;
  scale?: number;
}

export function RedPenScoreCircle({ scoreObtained, maxScore, scale = 1 }: RedPenScoreCircleProps) {
  // SVG path for a slightly imperfect, authentic handwritten red pen circle
  // with a realistic pen loop/overlap at the end
  const circlePath = "M 75,35 C 130,22 195,38 200,95 C 205,150 145,185 85,180 C 25,175 10,115 28,65 C 40,30 95,20 150,26 C 180,29 205,48 208,68";

  return (
    <div className="relative inline-flex items-center justify-center select-none" style={{ transform: `scale(${scale})` }}>
      {/* SVG Hand-drawn Circle Stroke */}
      <svg
        viewBox="0 0 230 210"
        className="w-56 h-52 md:w-64 md:h-60 overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle under-stroke for realistic pen ink density */}
        <motion.path
          d={circlePath}
          stroke="#B42318"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.35"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />

        {/* Primary ink stroke */}
        <motion.path
          d={circlePath}
          stroke="#B42318"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.95, ease: "easeInOut" }}
        />

        {/* Small teacher check mark near top right of circle */}
        <motion.path
          d="M 185,45 L 195,58 L 218,28"
          stroke="#B42318"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.85, ease: "easeOut" }}
        />
      </svg>

      {/* Numerical score centered inside */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center font-serif text-olympiad-redMark"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-baseline tracking-tight font-bold">
          <span className="text-6xl md:text-7xl font-mono text-olympiad-redMark">{scoreObtained}</span>
          <span className="text-3xl md:text-4xl text-olympiad-redMark/80 mx-1">/</span>
          <span className="text-3xl md:text-4xl font-mono text-olympiad-redMark/90">{maxScore}</span>
        </div>
      </motion.div>
    </div>
  );
}

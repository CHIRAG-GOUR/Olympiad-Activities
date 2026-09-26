"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  PieChart,
  Building2,
  Gem,
  Shapes,
  CheckCircle2,
  Sparkles,
  Thermometer,
  Pickaxe,
  Zap,
  Flame,
  Search,
  Layers,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q16 — 🌡️ Global Temperature Observatory (Siachen vs Chennai)
   Siachen: −30°C, Chennai: +30°C -> Diff = 60°C -> "None of these" (Option D)
   ══════════════════════════════════════════════════════════════════════ */
interface Q16World {
  siachenTemp: number;
  chennaiTemp: number;
  probeSelected: "diff" | "siachen" | "chennai";
}

export function B16GlobalTemperatureActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q16World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { siachenTemp: -30, chennaiTemp: 30, probeSelected: "diff" },
    derive: (w) => {
      const diff = w.chennaiTemp - w.siachenTemp; // 60
      return {
        value: `${diff}°C Difference (None of these)`,
        optionId: matchOption(question, "D") ?? "D",
        note: `Calculated difference = 30°C − (−30°C) = 60°C. Since 60°C is not in options A (6°C), B (65°C), or C (−6°C), the answer is None of these (Option D).`,
      };
    },
  });

  const diff = world.chennaiTemp - world.siachenTemp;

  return (
    <PlayShell
      title="Global Temperature Observatory"
      mission="Deploy thermal sensor probes to measure January temperatures at Siachen (−30°C) and Chennai (+30°C) to calculate their thermal difference."
      icon={Globe}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Measured Difference (ΔT)" value={`${diff}°C (None of these)`} />}
    >
      <div className="space-y-6">
        {/* 3D Global Weather Station Simulator */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 p-6 rounded-2xl text-white shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-sky-400" />
              Thermal Gauge Calibration
            </span>
            <span className="text-xs font-mono bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full border border-sky-500/40">
              ΔT = 30 − (−30) = 60°C
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Siachen Station */}
            <div className="bg-slate-900/80 border border-sky-500/40 p-4 rounded-xl text-center flex flex-col items-center">
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wide">
                ❄️ Siachen Probe
              </span>
              <div className="w-10 h-36 bg-slate-950 rounded-full border-2 border-sky-400 my-3 relative overflow-hidden flex flex-col justify-end p-1 shadow-inner">
                <div className="w-full bg-gradient-to-t from-sky-600 to-cyan-400 rounded-full h-[20%] animate-pulse" />
              </div>
              <span className="font-mono text-lg font-black text-sky-400">−30°C</span>
              <span className="text-[10px] text-slate-400 mt-1">Freezing Glacier Station</span>
            </div>

            {/* Differential Core */}
            <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-400/40 p-5 rounded-2xl text-center flex flex-col justify-center items-center shadow-lg">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
                Differential Calculation Core
              </span>
              <span className="text-4xl font-black font-mono text-amber-400 tracking-wider">
                60°C
              </span>
              <span className="text-xs text-slate-300 mt-2 font-mono">
                30°C − (−30°C) = 60°C
              </span>
              <div className="mt-4 px-3 py-1.5 bg-indigo-950/80 border border-indigo-500/40 rounded-lg text-[11px] text-rose-300 font-bold">
                No matching option in A, B, or C → Selects (None of these)
              </div>
            </div>

            {/* Chennai Station */}
            <div className="bg-slate-900/80 border border-rose-500/40 p-4 rounded-xl text-center flex flex-col items-center">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                ☀️ Chennai Probe
              </span>
              <div className="w-10 h-36 bg-slate-950 rounded-full border-2 border-rose-400 my-3 relative overflow-hidden flex flex-col justify-end p-1 shadow-inner">
                <div className="w-full bg-gradient-to-t from-orange-500 to-rose-500 rounded-full h-[80%] animate-pulse" />
              </div>
              <span className="font-mono text-lg font-black text-rose-400">+30°C</span>
              <span className="text-[10px] text-slate-400 mt-1">Coastal Station</span>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q17 — 🔠 Word Dissection Lab (Vowels in "MATHEMATICS" -> 4/11)
   Answer: D (4/11)
   ══════════════════════════════════════════════════════════════════════ */
const WORD_LETTERS = ["M", "A", "T", "H", "E", "M", "A", "T", "I", "C", "S"];
const VOWELS = new Set(["A", "E", "I", "O", "U"]);

interface Q17World {
  sortedVowels: string[];
  sortedConsonants: string[];
}

export function B17WordDissectionLabActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q17World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: {
      sortedVowels: ["A", "E", "A", "I"],
      sortedConsonants: ["M", "T", "H", "M", "T", "C", "S"],
    },
    derive: (w) => {
      const vowelCount = w.sortedVowels.length;
      const totalCount = vowelCount + w.sortedConsonants.length;
      const isTarget = vowelCount === 4 && totalCount === 11;
      return {
        value: `${vowelCount}/${totalCount}`,
        optionId: isTarget ? matchOption(question, "D") ?? "D" : undefined,
        note: `In 'MATHEMATICS' (11 letters), vowels are A, E, A, I (4 vowels). Fraction = 4/11 (Option D).`,
      };
    },
  });

  return (
    <PlayShell
      title="Word Dissection Lab"
      mission="Separate vowels from consonants in the word 'MATHEMATICS' to determine the fraction of vowels."
      icon={PieChart}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={
        <Gauge
          label="Vowel Ratio"
          value={`${world.sortedVowels.length} / ${world.sortedVowels.length + world.sortedConsonants.length}`}
        />
      }
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          {/* Letter Tiles Display */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {WORD_LETTERS.map((char, idx) => {
              const isVowel = VOWELS.has(char);
              return (
                <div
                  key={idx}
                  className={`w-11 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-base border-2 shadow-md transition-all ${
                    isVowel
                      ? "bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/20"
                      : "bg-indigo-900/30 border-indigo-500/40 text-indigo-300"
                  }`}
                >
                  <span>{char}</span>
                  <span className="text-[8px] opacity-60">{isVowel ? "V" : "C"}</span>
                </div>
              );
            })}
          </div>

          {/* Classification Chambers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-950/30 border border-amber-500/40 p-4 rounded-xl text-center">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                Vowel Chamber (A, E, A, I)
              </span>
              <span className="text-3xl font-black font-mono text-amber-300">
                {world.sortedVowels.length} Vowels
              </span>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-500/40 p-4 rounded-xl text-center">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-2">
                Total Letter Count
              </span>
              <span className="text-3xl font-black font-mono text-indigo-300">
                11 Letters
              </span>
            </div>
          </div>

          <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Vowel Fraction in 'MATHEMATICS'</span>
            <span className="text-3xl font-mono font-bold text-emerald-400">4 / 11</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q18 — 🏙️ Place Value City (637258 -> 30000 - 3 = 29997)
   Answer: A (29997)
   ══════════════════════════════════════════════════════════════════════ */
interface Q18World {
  targetDigit: number; // 3
  placeValue: number; // 30000
  faceValue: number; // 3
}

export function B18PlaceValueCityActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q18World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { targetDigit: 3, placeValue: 30000, faceValue: 3 },
    derive: (w) => {
      const diff = w.placeValue - w.faceValue; // 29997
      return {
        value: `${diff}`,
        optionId: diff === 29997 ? matchOption(question, "A") ?? "A" : undefined,
        note: `In 637258, digit 3 is in Ten-Thousands place. Place Value = 30,000. Face Value = 3. Difference = 30,000 − 3 = 29,997 (Option A).`,
      };
    },
  });

  const diff = world.placeValue - world.faceValue;

  return (
    <PlayShell
      title="Place Value City"
      mission="Extract the place value and face value of digit 3 in 637258 to calculate their difference."
      icon={Building2}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Difference" value={`${diff}`} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          {/* Place Value Towers */}
          <div className="grid grid-cols-6 gap-2 text-center mb-6">
            {[
              { place: "Hundred Th.", val: 6, weight: 100000, isTarget: false },
              { place: "Ten Th.", val: 3, weight: 10000, isTarget: true },
              { place: "Thousands", val: 7, weight: 1000, isTarget: false },
              { place: "Hundreds", val: 2, weight: 100, isTarget: false },
              { place: "Tens", val: 5, weight: 10, isTarget: false },
              { place: "Ones", val: 8, weight: 1, isTarget: false },
            ].map((col, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all ${
                  col.isTarget
                    ? "bg-amber-500/20 border-amber-400 shadow-lg ring-2 ring-amber-400/40"
                    : "bg-slate-800/60 border-slate-700"
                }`}
              >
                <span className="text-[9px] text-slate-400 block mb-1 truncate">{col.place}</span>
                <span className={`text-2xl font-mono font-black ${col.isTarget ? "text-amber-300" : "text-slate-200"}`}>
                  {col.val}
                </span>
                <span className="text-[9px] text-slate-500 block mt-1 font-mono">×{col.weight}</span>
              </div>
            ))}
          </div>

          {/* Subtraction Machine */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Place Value (3 × 10,000)</span>
                <span className="text-amber-400 font-bold">30,000</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Face Value</span>
                <span className="text-rose-400 font-bold">3</span>
              </div>
            </div>

            <div className="bg-indigo-950/60 border border-indigo-500/40 p-4 rounded-xl text-center flex flex-col justify-center">
              <span className="text-xs text-indigo-300 uppercase tracking-wider block mb-1">
                Calculated Difference
              </span>
              <span className="text-3xl font-black font-mono text-emerald-400">
                30,000 − 3 = {diff}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q19 — 💎 Prime Factor Mining: The Crystal Vault (7350 = 2 × 3 × 5² × 7²)
   Unique prime factors: 2, 3, 5, 7 -> Count = 4
   Answer: B (4)
   ══════════════════════════════════════════════════════════════════════ */
interface FactorStep {
  divisor: number;
  remaining: number;
  crystalName: string;
}

interface Q19World {
  remainingCore: number;
  extractedPrimes: number[];
  history: FactorStep[];
  statusMessage: string;
}

export function B19PrimeFactorMiningActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q19World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: {
      remainingCore: 1,
      extractedPrimes: [2, 3, 5, 5, 7, 7],
      history: [
        { divisor: 2, remaining: 3675, crystalName: "Ruby Prime (2)" },
        { divisor: 3, remaining: 1225, crystalName: "Topaz Prime (3)" },
        { divisor: 5, remaining: 245, crystalName: "Emerald Prime (5)" },
        { divisor: 5, remaining: 49, crystalName: "Emerald Prime (5)" },
        { divisor: 7, remaining: 7, crystalName: "Sapphire Prime (7)" },
        { divisor: 7, remaining: 1, crystalName: "Sapphire Prime (7)" },
      ],
      statusMessage: "Core 7350 fully mined into prime crystals: 2 × 3 × 5 × 5 × 7 × 7.",
    },
    derive: (w) => {
      const uniquePrimes = Array.from(new Set(w.extractedPrimes)); // [2, 3, 5, 7]
      const count = uniquePrimes.length;
      const isComplete = count === 4 && w.extractedPrimes.length === 6;

      return {
        value: `${count}`,
        optionId: isComplete ? matchOption(question, "B") ?? "B" : undefined,
        note: `Prime factorization: 7350 = 2 × 3 × 5² × 7². The distinct prime factors are 2, 3, 5, and 7 (Total 4 prime factors). (Option B: 4).`,
      };
    },
  });

  const uniquePrimes = Array.from(new Set(world.extractedPrimes));

  const applyDivisor = (p: number) => {
    if (locked || world.remainingCore <= 1) return;
    if (world.remainingCore % p === 0) {
      const nextRem = world.remainingCore / p;
      const crystalNames: Record<number, string> = {
        2: "Ruby Prime (2)",
        3: "Topaz Prime (3)",
        5: "Emerald Prime (5)",
        7: "Sapphire Prime (7)",
      };
      set((prev) => ({
        ...prev,
        remainingCore: nextRem,
        extractedPrimes: [...prev.extractedPrimes, p],
        history: [
          ...prev.history,
          { divisor: p, remaining: nextRem, crystalName: crystalNames[p] || `Prime (${p})` },
        ],
        statusMessage: `Extracted prime factor ${p}! Remaining core: ${nextRem}.`,
      }));
    } else {
      set((prev) => ({
        ...prev,
        statusMessage: `Cannot divide ${prev.remainingCore} evenly by ${p}. Try another prime laser.`,
      }));
    }
  };

  const restartMining = () => {
    set({
      remainingCore: 7350,
      extractedPrimes: [],
      history: [],
      statusMessage: "Mining laser armed. Core at 7350.",
    });
  };

  return (
    <PlayShell
      title="Prime Factor Mining: The Crystal Vault"
      mission="Drill into the glowing 7350 crystal core with prime mining lasers to extract and tally all distinct prime factor crystals in the vault."
      icon={Gem}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Distinct Prime Factor Types" value={`${uniquePrimes.length} Distinct Types ({2, 3, 5, 7})`} />}
    >
      <div className="space-y-6">
        {/* Underground Crystal Mine Stage */}
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 p-6 rounded-2xl text-white shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Pickaxe className="w-4 h-4" />
              Crystal Core Chamber
            </span>
            <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/40">
              Core Energy: {world.remainingCore}
            </span>
          </div>

          {/* Mine Core and Laser Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
            {/* Glowing Core Crystal */}
            <div className="bg-slate-950/80 border-2 border-indigo-500/40 p-6 rounded-xl flex flex-col items-center justify-center text-center relative shadow-inner min-h-[160px]">
              <motion.div
                animate={{
                  scale: world.remainingCore === 1 ? [1, 1.1, 1] : [1, 1.05, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-20 h-20 bg-gradient-to-tr from-indigo-600 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-pink-300 mb-3"
              >
                <Gem className="w-10 h-10 text-white animate-pulse" />
              </motion.div>
              <span className="text-2xl font-mono font-black text-white">
                {world.remainingCore === 1 ? "Fully Mined ✓" : `Core: ${world.remainingCore}`}
              </span>
              <span className="text-[11px] text-indigo-300 mt-1">{world.statusMessage}</span>
            </div>

            {/* Prime Laser Tools */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                Select Prime Mining Laser
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { p: 2, name: "Laser 2 (Ruby)", color: "from-rose-600 to-red-500 border-rose-400" },
                  { p: 3, name: "Laser 3 (Topaz)", color: "from-amber-600 to-yellow-500 border-amber-400" },
                  { p: 5, name: "Laser 5 (Emerald)", color: "from-emerald-600 to-teal-500 border-emerald-400" },
                  { p: 7, name: "Laser 7 (Sapphire)", color: "from-blue-600 to-cyan-500 border-cyan-400" },
                ].map((laser) => (
                  <button
                    key={laser.p}
                    onClick={() => applyDivisor(laser.p)}
                    disabled={locked || world.remainingCore <= 1}
                    className={`p-3 rounded-xl bg-gradient-to-r ${laser.color} text-white font-bold text-xs border shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40`}
                  >
                    ⚡ Divide by {laser.p}
                  </button>
                ))}
              </div>
              <button
                onClick={restartMining}
                disabled={locked}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono font-bold transition-all"
              >
                Reset Core to 7350
              </button>
            </div>
          </div>

          {/* The Crystal Vault (Distinct Prime Type Tally) */}
          <div className="bg-slate-950 p-5 rounded-xl border border-indigo-500/40">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Vault Storage: Distinct Prime Factor Crystals
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                {uniquePrimes.length} Distinct Types ({uniquePrimes.join(", ")})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { p: 2, name: "Prime 2", count: world.extractedPrimes.filter((x) => x === 2).length, col: "text-rose-400 border-rose-500/40" },
                { p: 3, name: "Prime 3", count: world.extractedPrimes.filter((x) => x === 3).length, col: "text-amber-400 border-amber-500/40" },
                { p: 5, name: "Prime 5", count: world.extractedPrimes.filter((x) => x === 5).length, col: "text-emerald-400 border-emerald-500/40" },
                { p: 7, name: "Prime 7", count: world.extractedPrimes.filter((x) => x === 7).length, col: "text-cyan-400 border-cyan-500/40" },
              ].map((c) => (
                <div key={c.p} className={`p-3 bg-slate-900 rounded-xl border ${c.col}`}>
                  <span className="text-xs font-bold block">{c.name}</span>
                  <span className="text-xl font-mono font-black">{c.count > 0 ? `×${c.count}` : "0"}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {c.count > 0 ? "Identified ✓" : "Locked"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q20 — 🛑 Geometry Certification Lab (Non-Polygon Plate -> Figure C)
   Answer: C
   ══════════════════════════════════════════════════════════════════════ */
interface Q20World {
  certifiedNonPolygon: string; // "C"
}

export function B20GeometryCertificationActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q20World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { certifiedNonPolygon: "C" },
    derive: (w) => {
      const isTarget = w.certifiedNonPolygon === "C";
      return {
        value: "Figure C (Not a polygon)",
        optionId: isTarget ? matchOption(question, "C") ?? "C" : undefined,
        note: `A polygon is a closed figure made up entirely of straight line segments. Figure C contains curved arc sections and is NOT a polygon. (Option C).`,
      };
    },
  });

  return (
    <PlayShell
      title="Geometry Certification Lab"
      mission="Scan the four geometry plates through the polygon validator to detect the shape that is NOT a polygon."
      icon={Shapes}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Identified Non-Polygon" value="Figure C (Contains Curves)" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: "A", name: "Figure A", isPoly: true, desc: "Closed polygon (6 straight edges)" },
            { id: "B", name: "Figure B", isPoly: true, desc: "Closed polygon (straight segments)" },
            { id: "C", name: "Figure C", isPoly: false, desc: "Fails: Contains curved boundary arcs" },
            { id: "D", name: "Figure D", isPoly: true, desc: "Closed star polygon (straight edges)" },
          ].map((fig) => {
            const isSelected = world.certifiedNonPolygon === fig.id;
            return (
              <div
                key={fig.id}
                onClick={() => !locked && set((prev) => ({ ...prev, certifiedNonPolygon: fig.id }))}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between text-center ${
                  isSelected
                    ? !fig.isPoly
                      ? "bg-rose-950/40 border-rose-500 shadow-lg ring-2 ring-rose-500/40"
                      : "bg-indigo-950/40 border-indigo-500 shadow-lg"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-white block mb-1">{fig.name}</span>
                  <span className="text-[10px] text-slate-400 block mb-2">{fig.desc}</span>
                </div>
                <div>
                  {fig.isPoly ? (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      Polygon ✓
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40 font-bold animate-pulse">
                      NOT A POLYGON ✗
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-white text-center">
          <span className="text-xs text-slate-400 block mb-1">Polygon Certification Rule</span>
          <span className="text-sm font-mono text-emerald-400 font-bold">
            Polygons must be 2D closed planar shapes bounded strictly by straight line segments. Figure C fails due to curved boundary arcs.
          </span>
        </div>
      </div>
    </PlayShell>
  );
}

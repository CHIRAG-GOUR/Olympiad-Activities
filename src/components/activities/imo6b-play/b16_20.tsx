"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  PieChart,
  Building2,
  Gem,
  Shapes,
  CheckCircle2,
  Sparkles,
  Thermometer,
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
    initial: { siachenTemp: -30, chennaiTemp: 30 },
    derive: (w) => {
      const diff = w.chennaiTemp - w.siachenTemp;
      return {
        value: `${diff}°C Difference (None of these)`,
        optionId: matchOption(question, "D") ?? "D",
        note: `Calculated difference = 30 − (−30) = 60°C. Since 60°C is not in options A, B, or C, the answer is None of these (Option D).`,
      };
    },
  });

  return (
    <PlayShell
      title="Global Temperature Observatory"
      mission="Compare January temperature readings at Siachen (−30°C) and Chennai (30°C) on vertical gauge pins."
      icon={Globe}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Temperature Difference" value={`${world.chennaiTemp - world.siachenTemp}°C`} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-sky-50 border border-indigo-200 p-6 rounded-2xl flex items-center justify-around shadow-sm">
          {/* Siachen Pin */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-sky-900">Siachen Pin</span>
            <div className="w-10 h-32 bg-white rounded-full border-2 border-sky-400 my-2 relative overflow-hidden flex flex-col justify-end p-1 shadow-inner">
              <div className="w-full bg-sky-500 rounded-full" style={{ height: "15%" }} />
            </div>
            <span className="font-mono text-sm font-black text-sky-700">−30°C</span>
          </div>

          {/* Scale Arrow */}
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full shadow-xs">
              ΔT = 60°C
            </span>
            <span className="text-[10px] text-slate-500 mt-1">30 − (−30) = 60°C</span>
          </div>

          {/* Chennai Pin */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-rose-900">Chennai Pin</span>
            <div className="w-10 h-32 bg-white rounded-full border-2 border-rose-400 my-2 relative overflow-hidden flex flex-col justify-end p-1 shadow-inner">
              <div className="w-full bg-rose-500 rounded-full" style={{ height: "85%" }} />
            </div>
            <span className="font-mono text-sm font-black text-rose-700">+30°C</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q17 — 🅰️ Word Dissection Lab (Vowels in MATHEMATICS)
   Result: 4/11 (Option D)
   ══════════════════════════════════════════════════════════════════════ */
interface Q17World {
  vowelCount: number;
  totalLetters: number;
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
    initial: { vowelCount: 4, totalLetters: 11 },
    derive: (w) => {
      const is4_11 = w.vowelCount === 4 && w.totalLetters === 11;
      return {
        value: `${w.vowelCount}/${w.totalLetters} Vowels`,
        optionId: is4_11 ? matchOption(question, "D") ?? "D" : matchOption(question, "A") ?? "A",
        note: is4_11
          ? "Word dissection complete: 4 vowels (A, E, A, I) out of 11 letters = 4/11."
          : `Current fraction: ${w.vowelCount}/${w.totalLetters}.`,
      };
    },
  });

  return (
    <PlayShell
      title="Word Dissection Lab"
      mission="Dissect the word MATHEMATICS into Vowel and Consonant chambers to calculate the exact vowel fraction."
      icon={PieChart}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Vowel Fraction" value={`${world.vowelCount}/${world.totalLetters}`} />}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Vowel Chamber */}
          <div className="p-4 bg-purple-50 border-2 border-purple-300 rounded-2xl text-center shadow-xs">
            <span className="text-xs font-bold text-purple-900">Vowel Chamber (4 Tiles)</span>
            <div className="flex justify-center gap-1.5 my-3">
              {["A", "E", "A", "I"].map((v, i) => (
                <span key={i} className="w-9 h-10 bg-purple-600 text-white font-mono font-black text-lg rounded-lg flex items-center justify-center shadow-sm">
                  {v}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-purple-700 font-bold">Count = 4 Vowels</span>
          </div>

          {/* Consonant Chamber */}
          <div className="p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl text-center shadow-xs">
            <span className="text-xs font-bold text-slate-700">Consonant Chamber (7 Tiles)</span>
            <div className="flex justify-center gap-1.5 my-3 flex-wrap">
              {["M", "T", "H", "M", "T", "C", "S"].map((c, i) => (
                <span key={i} className="w-8 h-10 bg-slate-700 text-white font-mono font-bold text-base rounded-lg flex items-center justify-center shadow-sm">
                  {c}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-slate-600 font-medium">Count = 7 Consonants</span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q18 — 🏙️ Place Value City (637258: 30000 − 3 = 29997)
   Result: 29997 (Option A)
   ══════════════════════════════════════════════════════════════════════ */
interface Q18World {
  placeVal: number;
  faceVal: number;
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
    initial: { placeVal: 30000, faceVal: 3 },
    derive: (w) => {
      const diff = w.placeVal - w.faceVal;
      const is29997 = diff === 29997;
      return {
        value: `${diff} (${w.placeVal} − ${w.faceVal})`,
        optionId: is29997 ? matchOption(question, "A") ?? "A" : matchOption(question, "B") ?? "B",
        note: is29997
          ? "Place value (30,000) minus Face value (3) = 29,997."
          : `Current difference: ${diff}.`,
      };
    },
  });

  return (
    <PlayShell
      title="Place Value City"
      mission="Inspect the digit 3 in positional tower 6,37,258 to calculate the difference between its place value and face value."
      icon={Building2}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Computed Difference" value={`${world.placeVal - world.faceVal}`} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
          <div className="text-xs font-mono font-bold text-slate-500 mb-1">Number: 6,37,258</div>
          <div className="font-mono text-3xl font-black text-slate-800 my-2">
            6 <span className="text-indigo-600 underline font-black">3</span> 7 , 2 5 8
          </div>
          <div className="flex gap-4 my-2 text-xs font-mono font-bold">
            <span className="p-2 bg-indigo-100 text-indigo-900 rounded-lg">Place Value: 30,000</span>
            <span className="p-2 bg-purple-100 text-purple-900 rounded-lg">Face Value: 3</span>
          </div>
          <div className="mt-2 text-xs font-mono text-emerald-900 font-bold bg-emerald-100 px-3 py-1 rounded-full">
            30,000 − 3 = 29,997
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q19 — 💎 Prime Factor Mining (7350 -> 4 Prime Factors)
   Result: 4 Distinct Prime Factors: 2, 3, 5, 7 (Option B)
   ══════════════════════════════════════════════════════════════════════ */
interface Q19World {
  primeCount: number;
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
    initial: { primeCount: 4 },
    derive: (w) => {
      const is4 = w.primeCount === 4;
      return {
        value: `${w.primeCount} Prime Factors (2, 3, 5, 7)`,
        optionId: is4 ? matchOption(question, "B") ?? "B" : matchOption(question, "A") ?? "A",
        note: is4
          ? "Prime factorization 7350 = 2 × 3 × 5² × 7² contains exactly 4 distinct prime factors."
          : `Current factor count: ${w.primeCount}.`,
      };
    },
  });

  return (
    <PlayShell
      title="Prime Factor Mining"
      mission="Mine and extract the unique prime crystals composing composite integer 7350."
      icon={Gem}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Distinct Prime Factors" value={`${world.primeCount}`} />}
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-xs font-mono font-bold text-slate-500">Crystal 7350 Factorization Tree</span>
          <div className="flex gap-2 my-3">
            {[2, 3, 5, 7].map((p) => (
              <div key={p} className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-mono font-black text-xl flex items-center justify-center shadow-md">
                {p}
              </div>
            ))}
          </div>
          <span className="text-xs font-mono text-indigo-900 font-bold bg-indigo-100 px-3 py-1 rounded-full">
            7350 = 2 × 3 × 5² × 7² (4 distinct primes)
          </span>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q20 — 🔷 Geometry Certification Lab (Which is NOT a polygon?)
   Result: Figure C (curved boundary) -> Option C
   ══════════════════════════════════════════════════════════════════════ */
interface Q20World {
  certifiedNonPolygon: "A" | "B" | "C" | "D";
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
      const isC = w.certifiedNonPolygon === "C";
      return {
        value: `Figure ${w.certifiedNonPolygon} is not a polygon`,
        optionId: isC ? matchOption(question, "C") ?? "C" : matchOption(question, "A") ?? "A",
        note: isC
          ? "Certification scanner detects curved boundary in Figure C, violating straight segment polygon rule."
          : `Figure ${w.certifiedNonPolygon} meets polygon segment rules.`,
      };
    },
  });

  return (
    <PlayShell
      title="Geometry Certification Lab"
      mission="Test the 4 geometry plates through the polygon certification scanner to find which figure fails straight line segment criteria."
      icon={Shapes}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Identified Non-Polygon" value={`Figure ${world.certifiedNonPolygon}`} />}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: "A" as const, label: "Fig A", polygon: true },
            { id: "B" as const, label: "Fig B", polygon: true },
            { id: "C" as const, label: "Fig C", polygon: false },
            { id: "D" as const, label: "Fig D", polygon: true },
          ].map((fig) => (
            <div
              key={fig.id}
              onClick={() => !locked && set({ certifiedNonPolygon: fig.id })}
              className={`p-3 rounded-xl border-2 cursor-pointer text-center transition-all flex flex-col items-center justify-between ${
                world.certifiedNonPolygon === fig.id
                  ? "bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-200"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="font-bold text-xs text-slate-700">{fig.label}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded my-2 ${fig.polygon ? "bg-slate-100 text-slate-700" : "bg-rose-100 text-rose-800"}`}>
                {fig.polygon ? "Straight Edges" : "Curved Boundary ✗"}
              </span>
              <button
                type="button"
                className={`text-[10px] font-bold px-2 py-0.5 rounded w-full ${
                  world.certifiedNonPolygon === fig.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {world.certifiedNonPolygon === fig.id ? "Selected" : "Test " + fig.id}
              </button>
            </div>
          ))}
        </div>
      </div>
    </PlayShell>
  );
}

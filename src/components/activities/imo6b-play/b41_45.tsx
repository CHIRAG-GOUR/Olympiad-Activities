"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Hammer,
  Landmark,
  Laptop,
  ShoppingCart,
  Calculator,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q41 — 🔨 Roman Numeral Forge (2860 -> MMDCCCLX)
   2000 (MM) + 800 (DCCC) + 60 (LX) = MMDCCCLX
   Answer: C (MMDCCCLX)
   ══════════════════════════════════════════════════════════════════════ */
interface Q41World {
  numeral: string;
}

export function B41RomanNumeralForgeActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q41World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { numeral: "MMDCCCLX" },
    derive: (w) => {
      const isTarget = w.numeral === "MMDCCCLX";
      return {
        value: w.numeral,
        optionId: isTarget ? matchOption(question, "C") ?? "C" : undefined,
        note: `2860 = 2000 (MM) + 800 (DCCC) + 60 (LX) = MMDCCCLX. (Option C: MMDCCCLX).`,
      };
    },
  });

  return (
    <PlayShell
      title="Roman Numeral Forge"
      mission="Forge the Roman numeral representation of Rohan's ₹2860 savings."
      icon={Hammer}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Forged Numeral" value={world.numeral} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          {/* Target Amount */}
          <div className="text-center mb-6">
            <span className="text-xs text-slate-400 block mb-1">Target Savings</span>
            <span className="text-3xl font-black font-mono text-amber-400">₹2860</span>
          </div>

          {/* Place Value Ingot Decomposition */}
          <div className="grid grid-cols-3 gap-3 mb-6 text-center">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">2000 (Thousands)</span>
              <span className="text-xl font-mono font-bold text-sky-400">MM</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">800 (Hundreds)</span>
              <span className="text-xl font-mono font-bold text-amber-400">DCCC</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">60 (Tens)</span>
              <span className="text-xl font-mono font-bold text-emerald-400">LX</span>
            </div>
          </div>

          {/* Master Forge Display */}
          <div className="bg-slate-950 border-2 border-amber-500/50 p-4 rounded-xl text-center">
            <span className="text-xs text-slate-400 block mb-1">Constructed Roman Numeral</span>
            <span className="text-3xl font-black font-mono text-amber-300 tracking-widest">
              {world.numeral}
            </span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q42 — 🏦 Bank Account Simulator (125 − 117 + 45 − 69 = ₹(-16))
   Answer: A (₹(-16))
   ══════════════════════════════════════════════════════════════════════ */
interface Q42World {
  initialBalance: number;
  w1: number;
  d1: number;
  w2: number;
}

export function B42BankAccountSimulatorActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q42World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { initialBalance: 125, w1: 117, d1: 45, w2: 69 },
    derive: (w) => {
      const balance = w.initialBalance - w.w1 + w.d1 - w.w2; // -16
      const isTarget = balance === -16;
      return {
        value: `₹(${balance})`,
        optionId: isTarget ? matchOption(question, "A") ?? "A" : undefined,
        note: `Balance = 125 − 117 + 45 − 69 = 8 + 45 − 69 = 53 − 69 = −16. (Option A: ₹(-16)).`,
      };
    },
  });

  const balance = world.initialBalance - world.w1 + world.d1 - world.w2;

  return (
    <PlayShell
      title="Bank Account Simulator"
      mission="Simulate Arun's deposit and withdrawal transactions to calculate the final bank balance."
      icon={Landmark}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Account Net Balance" value={`₹(${balance})`} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          {/* Ledger Table */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between p-2.5 bg-slate-800/60 rounded-lg text-xs font-mono">
              <span className="text-slate-300">Initial Balance</span>
              <span className="text-sky-400 font-bold">+₹125</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-800/60 rounded-lg text-xs font-mono">
              <span className="text-slate-300">Withdrawal 1</span>
              <span className="text-rose-400 font-bold">−₹117</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-800/60 rounded-lg text-xs font-mono">
              <span className="text-slate-300">Deposit</span>
              <span className="text-emerald-400 font-bold">+₹45</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-800/60 rounded-lg text-xs font-mono">
              <span className="text-slate-300">Withdrawal 2</span>
              <span className="text-rose-400 font-bold">−₹69</span>
            </div>
          </div>

          {/* Final Overdraft Display */}
          <div className="bg-slate-950 border-2 border-rose-500/40 p-4 rounded-xl text-center">
            <span className="text-xs text-slate-400 block mb-1">Final Ledger Balance</span>
            <span className="text-3xl font-black font-mono text-rose-400">
              ₹({balance})
            </span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q43 — 💻 Factory Production Floor (8,75,677 − 3,37,563 = 5,38,114)
   Answer: D (5,38,114)
   ══════════════════════════════════════════════════════════════════════ */
interface Q43World {
  total: number;
  typeP: number;
}

export function B43LaptopFactoryActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q43World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { total: 875677, typeP: 337563 },
    derive: (w) => {
      const typeQ = w.total - w.typeP; // 538114
      const isTarget = typeQ === 538114;
      return {
        value: `${typeQ.toLocaleString("en-IN")}`,
        optionId: isTarget ? matchOption(question, "D") ?? "D" : undefined,
        note: `Total laptops = 8,75,677. Type P = 3,37,563. Type Q = 8,75,677 − 3,37,563 = 5,38,114. (Option D: 5,38,114).`,
      };
    },
  });

  const typeQ = world.total - world.typeP;

  return (
    <PlayShell
      title="Laptop Production Floor"
      mission="Calculate Type Q laptop production by subtracting Type P units from total factory production."
      icon={Laptop}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Type Q Production" value={`${typeQ.toLocaleString("en-IN")} Units`} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Total Production (P + Q)</span>
              <span className="text-2xl font-mono font-bold text-sky-400">
                8,75,677
              </span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Type P Production</span>
              <span className="text-2xl font-mono font-bold text-amber-400">
                3,37,563
              </span>
            </div>
          </div>

          <div className="bg-indigo-950/60 border border-indigo-500/40 p-5 rounded-xl text-center">
            <span className="text-xs text-indigo-300 uppercase tracking-wider block mb-1">
              Type Q Production (Total − Type P)
            </span>
            <span className="text-3xl font-black font-mono text-emerald-400">
              {typeQ.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q44 — 🛒 Supermarket Checkout (5000 − 745 = ₹4255)
   Chocolates: 2 × 52.98 = 105.96
   Chips: 3 × 12.98 = 38.94
   Books: 2 × 300.05 = 600.10
   Total = 745.00
   Change = 5000 − 745 = 4255
   Answer: A (₹4255)
   ══════════════════════════════════════════════════════════════════════ */
interface Q44World {
  initialCash: number;
  totalSpent: number;
}

export function B44SupermarketCheckoutActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q44World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { initialCash: 5000, totalSpent: 745 },
    derive: (w) => {
      const change = w.initialCash - w.totalSpent;
      const isTarget = change === 4255;
      return {
        value: `₹${change}`,
        optionId: isTarget ? matchOption(question, "A") ?? "A" : undefined,
        note: `Items: 2 chocolates (₹105.96) + 3 chips (₹38.94) + 2 books (₹600.10) = ₹745.00. Remaining money = 5000 − 745 = ₹4255. (Option A: ₹4255).`,
      };
    },
  });

  const change = world.initialCash - world.totalSpent;

  return (
    <PlayShell
      title="Supermarket Checkout"
      mission="Tally Prerna's cart total and calculate her remaining cash balance from ₹5000."
      icon={ShoppingCart}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Remaining Cash" value={`₹${change}`} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          {/* Itemized Receipt */}
          <div className="space-y-2 mb-6 text-xs font-mono">
            <div className="flex justify-between p-2.5 bg-slate-800/60 rounded-lg">
              <span>2 Chocolate Boxes @ ₹52.98</span>
              <span className="text-amber-400">₹105.96</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-800/60 rounded-lg">
              <span>3 Chip Packets @ ₹12.98</span>
              <span className="text-amber-400">₹38.94</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-800/60 rounded-lg">
              <span>2 Books @ ₹300.05</span>
              <span className="text-amber-400">₹600.10</span>
            </div>
            <div className="flex justify-between p-2.5 bg-indigo-950/40 border border-indigo-500/30 rounded-lg font-bold">
              <span className="text-indigo-300">Total Purchase</span>
              <span className="text-white">₹745.00</span>
            </div>
          </div>

          <div className="bg-slate-950 border-2 border-emerald-500/50 p-4 rounded-xl text-center">
            <span className="text-xs text-slate-400 block mb-1">Remaining Cash (₹5000 − ₹745)</span>
            <span className="text-3xl font-black font-mono text-emerald-400">
              ₹{change}
            </span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q45 — 🏭 Rounding Factory (1250 + 3130 + 4110 = 8490 -> None of these)
   Answer: D (None of these)
   ══════════════════════════════════════════════════════════════════════ */
interface Q45World {
  r1: number; // 1248 -> 1250
  r2: number; // 3127 -> 3130
  r3: number; // 4105 -> 4110
}

export function B45RoundingFactoryActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q45World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { r1: 1250, r2: 3130, r3: 4110 },
    derive: (w) => {
      const sum = w.r1 + w.r2 + w.r3; // 8490
      return {
        value: `${sum} (None of these)`,
        optionId: sum === 8490 ? matchOption(question, "D") ?? "D" : undefined,
        note: `1248 rounded to nearest ten = 1250. 3127 rounded to nearest ten = 3130. 4105 rounded to nearest ten = 4110. Sum = 1250 + 3130 + 4110 = 8490. Since 8490 is not 7500, 8000, or 8480, answer is None of these (Option D).`,
      };
    },
  });

  const sum = world.r1 + world.r2 + world.r3;

  return (
    <PlayShell
      title="Rounding Factory"
      mission="Round off 1248, 3127, and 4105 to nearest tens and calculate their estimated sum."
      icon={Calculator}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Estimated Sum" value={`${sum} (None of these)`} />}
    >
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white shadow-xl">
          <div className="grid grid-cols-3 gap-3 mb-6 text-center">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">1248 ≈</span>
              <span className="text-xl font-mono font-bold text-sky-400">1250</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">3127 ≈</span>
              <span className="text-xl font-mono font-bold text-amber-400">3130</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">4105 ≈</span>
              <span className="text-xl font-mono font-bold text-emerald-400">4110</span>
            </div>
          </div>

          <div className="bg-slate-950 border-2 border-indigo-500/50 p-4 rounded-xl text-center">
            <span className="text-xs text-slate-400 block mb-1">Calculated Sum (1250 + 3130 + 4110)</span>
            <span className="text-3xl font-black font-mono text-white">8490</span>
            <span className="text-xs text-rose-400 block mt-2 font-bold">
              Result 8490 not in A, B, or C → Selects Option D (None of these)
            </span>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

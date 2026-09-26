"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Shapes,
  Shield,
  Zap,
  Cpu,
  RotateCw,
  Plus,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
} from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { PlayShell, Bay, Gauge, Btn } from "../imo6a-play/PlayShell";

/* ══════════════════════════════════════════════════════════════════════
   Q1 — 🏠 Family Detective House (3D/2D Relationship Graph)
   Statement: "His mother is the only daughter of my mother."
   Result: Lady is Ankit's Mother (Option C)
   ══════════════════════════════════════════════════════════════════════ */
interface Q1World {
  ladyMotherConnected: boolean;
  daughterIdentified: boolean; // "only daughter of my mother" = the lady herself
  ankitMotherConnected: boolean;
}

export function B01FamilyDetectiveHouseActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q1World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: {
      ladyMotherConnected: false,
      daughterIdentified: false,
      ankitMotherConnected: false,
    },
    derive: (w) => {
      const isComplete = w.ladyMotherConnected && w.daughterIdentified && w.ankitMotherConnected;
      const relation = isComplete ? "Mother" : undefined;
      return {
        value: relation,
        optionId: relation ? matchOption(question, "C") ?? matchText(question, "Mother") ?? "C" : undefined,
        note: isComplete
          ? "Logical deduction verified: Only daughter of Lady's mother = Lady herself. Therefore, Lady = Ankit's Mother."
          : "Connect all family nodes along the deduction path to solve the relationship.",
      };
    },
  });

  return (
    <PlayShell
      title="Family Detective House"
      mission="Trace the deduction path in the family house: 'His mother is the only daughter of my mother.' Connect all relationships to deduce how the lady is related to Ankit."
      icon={Users}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Deduced Relation" value={derived.value ?? "Incomplete Graph"} />}
    >
      <div className="space-y-4">
        {/* 3D Isometric Family House Graph Stage */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
          <div className="text-xs font-mono font-bold text-indigo-300 mb-4 flex items-center justify-between">
            <span>Deduction Graph: Family Detective Chamber</span>
            <span className="text-amber-400">
              {world.ladyMotherConnected && world.daughterIdentified && world.ankitMotherConnected
                ? "Graph Validated ✓"
                : "Active Links Needed"}
            </span>
          </div>

          {/* Node Visualizer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
            {/* Room 1: Lady's Mother */}
            <div
              onClick={() => !locked && set((w) => ({ ...w, ladyMotherConnected: !w.ladyMotherConnected }))}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center ${
                world.ladyMotherConnected
                  ? "bg-indigo-900/60 border-indigo-400 shadow-md ring-2 ring-indigo-400/40"
                  : "bg-slate-800/60 border-slate-700 hover:border-indigo-400/60"
              }`}
            >
              <span className="text-[11px] font-mono text-indigo-300 font-bold">Node 1: Ascendant</span>
              <div className="w-14 h-14 rounded-full bg-indigo-600/40 border-2 border-indigo-400 flex items-center justify-center my-2 shadow-inner">
                <Users className="w-7 h-7 text-indigo-200" />
              </div>
              <span className="font-bold text-sm text-slate-100">Lady's Mother</span>
              <span className="text-[10px] text-indigo-300 mt-1">
                {world.ladyMotherConnected ? "Linked to Lady ✓" : "Click to Connect Link"}
              </span>
            </div>

            {/* Room 2: Only Daughter (The Lady) */}
            <div
              onClick={() => !locked && set((w) => ({ ...w, daughterIdentified: !w.daughterIdentified }))}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center ${
                world.daughterIdentified
                  ? "bg-purple-900/60 border-purple-400 shadow-md ring-2 ring-purple-400/40"
                  : "bg-slate-800/60 border-slate-700 hover:border-purple-400/60"
              }`}
            >
              <span className="text-[11px] font-mono text-purple-300 font-bold">Node 2: Deduction Pivot</span>
              <div className="w-14 h-14 rounded-full bg-purple-600/40 border-2 border-purple-400 flex items-center justify-center my-2 shadow-inner">
                <Users className="w-7 h-7 text-purple-200" />
              </div>
              <span className="font-bold text-sm text-slate-100">"Only Daughter" = Lady Herself</span>
              <span className="text-[10px] text-purple-300 mt-1">
                {world.daughterIdentified ? "Identity Confirmed ✓" : "Click to Confirm Identity"}
              </span>
            </div>

            {/* Room 3: Ankit's Mother */}
            <div
              onClick={() => !locked && set((w) => ({ ...w, ankitMotherConnected: !w.ankitMotherConnected }))}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center ${
                world.ankitMotherConnected
                  ? "bg-emerald-900/60 border-emerald-400 shadow-md ring-2 ring-emerald-400/40"
                  : "bg-slate-800/60 border-slate-700 hover:border-emerald-400/60"
              }`}
            >
              <span className="text-[11px] font-mono text-emerald-300 font-bold">Node 3: Target</span>
              <div className="w-14 h-14 rounded-full bg-emerald-600/40 border-2 border-emerald-400 flex items-center justify-center my-2 shadow-inner">
                <Users className="w-7 h-7 text-emerald-200" />
              </div>
              <span className="font-bold text-sm text-slate-100">Ankit's Mother</span>
              <span className="text-[10px] text-emerald-300 mt-1">
                {world.ankitMotherConnected ? "Linked to Ankit ✓" : "Click to Link to Ankit"}
              </span>
            </div>
          </div>

          {/* Quick Solver Controls */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Graph Links: {Number(world.ladyMotherConnected) + Number(world.daughterIdentified) + Number(world.ankitMotherConnected)} / 3
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={locked}
                onClick={() =>
                  set({
                    ladyMotherConnected: true,
                    daughterIdentified: true,
                    ankitMotherConnected: true,
                  })
                }
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                Assemble Complete Graph
              </button>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q2 — 🔬 Spatial Blueprint Laboratory (Dot & Shape Overlap Placement)
   Reference: Dot inside Circle & Triangle only (outside Square)
   Result: Option D
   ══════════════════════════════════════════════════════════════════════ */
interface Q2World {
  dotRegion: "circle_only" | "triangle_only" | "square_only" | "circle_triangle" | "circle_square" | "triangle_square" | "all_three";
}

export function B02SpatialBlueprintLabActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q2World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { dotRegion: "circle_triangle" },
    derive: (w) => {
      const isTarget = w.dotRegion === "circle_triangle";
      return {
        value: `Dot in ${w.dotRegion.replace("_", " & ")} (outside third shape)`,
        optionId: isTarget ? matchOption(question, "D") ?? "D" : matchOption(question, "A") ?? "A",
        note: isTarget
          ? "Dot placement matches reference: inside (Circle ∩ Triangle) strictly outside Square."
          : `Current placement (${w.dotRegion}) does not match the reference containment conditions.`,
      };
    },
  });

  return (
    <PlayShell
      title="Spatial Blueprint Laboratory"
      mission="Place the probe dot into the unique region common to the Circle and Triangle strictly outside the Square, replicating the reference blueprint."
      icon={Shapes}
      dim="2D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Probe Dot Region" value={world.dotRegion.replace("_", " & ")} />}
    >
      <div className="space-y-4">
        {/* Interactive Spatial Blueprint Board */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
          <div className="w-full max-w-sm aspect-square relative bg-white rounded-xl border-2 border-slate-200 shadow-inner p-4">
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-md">
              {/* Outer Square */}
              <rect x="110" y="110" width="150" height="150" fill="#f8fafc" stroke="#64748b" strokeWidth="3" rx="2" />
              <text x="250" y="250" fill="#64748b" fontSize="12" fontWeight="bold">Square</text>

              {/* Triangle */}
              <polygon points="150,30 270,230 30,230" fill="none" stroke="#ef4444" strokeWidth="3" />
              <text x="50" y="245" fill="#ef4444" fontSize="12" fontWeight="bold">Triangle</text>

              {/* Circle */}
              <circle cx="120" cy="110" r="70" fill="none" stroke="#3b82f6" strokeWidth="3" />
              <text x="60" y="70" fill="#3b82f6" fontSize="12" fontWeight="bold">Circle</text>

              {/* Clickable Probe Zones */}
              {/* Target Zone: Circle ∩ Triangle outside Square */}
              <circle
                cx="110"
                cy="100"
                r="18"
                onClick={() => !locked && set({ dotRegion: "circle_triangle" })}
                className="cursor-pointer"
                fill={world.dotRegion === "circle_triangle" ? "#f59e0b" : "#e0e7ff"}
                stroke="#d97706"
                strokeWidth={world.dotRegion === "circle_triangle" ? "3" : "1"}
                opacity={world.dotRegion === "circle_triangle" ? 1 : 0.6}
              />
              <text x="110" y="104" fill="#1e1b4b" fontSize="9" fontWeight="black" textAnchor="middle" pointerEvents="none">
                {world.dotRegion === "circle_triangle" ? "● Probe" : "Target"}
              </text>

              {/* Zone: All Three */}
              <circle
                cx="150"
                cy="150"
                r="14"
                onClick={() => !locked && set({ dotRegion: "all_three" })}
                className="cursor-pointer"
                fill={world.dotRegion === "all_three" ? "#f59e0b" : "#f1f5f9"}
                stroke="#64748b"
                strokeWidth="1"
              />

              {/* Zone: Triangle Only */}
              <circle
                cx="200"
                cy="70"
                r="14"
                onClick={() => !locked && set({ dotRegion: "triangle_only" })}
                className="cursor-pointer"
                fill={world.dotRegion === "triangle_only" ? "#f59e0b" : "#f1f5f9"}
                stroke="#64748b"
                strokeWidth="1"
              />
            </svg>
          </div>

          <div className="mt-4 flex gap-2 flex-wrap justify-center">
            {[
              { id: "circle_triangle", label: "Circle ∩ Triangle (Target)" },
              { id: "all_three", label: "All Three Shapes" },
              { id: "triangle_only", label: "Triangle Only" },
            ].map((reg) => (
              <button
                key={reg.id}
                type="button"
                disabled={locked}
                onClick={() => set({ dotRegion: reg.id as any })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  world.dotRegion === reg.id
                    ? "bg-indigo-600 text-white border-indigo-700 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q3 — 🏙️ City Role Sorting (Judge, Police, Thief Venn Simulation)
   Result: Three separate disjoint categories (Option D)
   ══════════════════════════════════════════════════════════════════════ */
interface Q3World {
  judgeZone: "courthouse" | "police_station" | "streets";
  policeZone: "courthouse" | "police_station" | "streets";
  thiefZone: "courthouse" | "police_station" | "streets";
}

export function B03CityRoleSortingActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q3World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: {
      judgeZone: "courthouse",
      policeZone: "police_station",
      thiefZone: "streets",
    },
    derive: (w) => {
      const isDisjoint =
        w.judgeZone !== w.policeZone &&
        w.policeZone !== w.thiefZone &&
        w.judgeZone !== w.thiefZone;

      return {
        value: isDisjoint ? "Three Disjoint Sets (No Overlap)" : "Overlapping Groups",
        optionId: isDisjoint ? matchOption(question, "D") ?? "D" : matchOption(question, "A") ?? "A",
        note: isDisjoint
          ? "Role classification valid: Judge, Police, and Thief have entirely mutually exclusive roles (3 non-overlapping circles)."
          : "Roles are currently overlapped. Verify whether a person can be both a Judge and a Thief.",
      };
    },
  });

  return (
    <PlayShell
      title="City Role Sorting"
      mission="Place Judge, Police, and Thief character tokens into their distinct city zones to establish the correct categorical Venn relationship."
      icon={Shield}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Venn Structure" value={derived.value ?? "Configuring"} />}
    >
      <div className="space-y-4">
        {/* 3D City Zones Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Zone 1: Courthouse */}
          <div className="p-4 bg-gradient-to-b from-amber-50 to-amber-100/60 border-2 border-amber-300 rounded-2xl flex flex-col items-center justify-between text-center min-h-[160px] shadow-sm">
            <span className="text-xs font-mono font-bold text-amber-900">Zone 1: Courthouse</span>
            <div className="my-2 p-3 bg-white border border-amber-200 rounded-xl shadow-xs">
              <span className="font-bold text-sm text-slate-800">
                {world.judgeZone === "courthouse" && "⚖️ Judge"}
                {world.policeZone === "courthouse" && " 👮 Police"}
                {world.thiefZone === "courthouse" && " 🦹 Thief"}
              </span>
            </div>
            <button
              type="button"
              disabled={locked}
              onClick={() => set((w) => ({ ...w, judgeZone: "courthouse" }))}
              className="text-[11px] font-bold px-2.5 py-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Assign Judge Here
            </button>
          </div>

          {/* Zone 2: Police Station */}
          <div className="p-4 bg-gradient-to-b from-blue-50 to-blue-100/60 border-2 border-blue-300 rounded-2xl flex flex-col items-center justify-between text-center min-h-[160px] shadow-sm">
            <span className="text-xs font-mono font-bold text-blue-900">Zone 2: Police Station</span>
            <div className="my-2 p-3 bg-white border border-blue-200 rounded-xl shadow-xs">
              <span className="font-bold text-sm text-slate-800">
                {world.judgeZone === "police_station" && "⚖️ Judge"}
                {world.policeZone === "police_station" && " 👮 Police"}
                {world.thiefZone === "police_station" && " 🦹 Thief"}
              </span>
            </div>
            <button
              type="button"
              disabled={locked}
              onClick={() => set((w) => ({ ...w, policeZone: "police_station" }))}
              className="text-[11px] font-bold px-2.5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Assign Police Here
            </button>
          </div>

          {/* Zone 3: Streets / Holding */}
          <div className="p-4 bg-gradient-to-b from-rose-50 to-rose-100/60 border-2 border-rose-300 rounded-2xl flex flex-col items-center justify-between text-center min-h-[160px] shadow-sm">
            <span className="text-xs font-mono font-bold text-rose-900">Zone 3: Detention Streets</span>
            <div className="my-2 p-3 bg-white border border-rose-200 rounded-xl shadow-xs">
              <span className="font-bold text-sm text-slate-800">
                {world.judgeZone === "streets" && "⚖️ Judge"}
                {world.policeZone === "streets" && " 👮 Police"}
                {world.thiefZone === "streets" && " 🦹 Thief"}
              </span>
            </div>
            <button
              type="button"
              disabled={locked}
              onClick={() => set((w) => ({ ...w, thiefZone: "streets" }))}
              className="text-[11px] font-bold px-2.5 py-1 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
            >
              Assign Thief Here
            </button>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q4 — ⚡ Sequence Power Reactor (B4M → D7L → F11K → H16J → ?)
   Result: J22I (Option A)
   ══════════════════════════════════════════════════════════════════════ */
interface Q4World {
  letter1: string; // Target: 'J'
  numVal: number;  // Target: 22
  letter2: string; // Target: 'I'
}

export function B04SequencePowerReactorActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q4World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { letter1: "J", numVal: 22, letter2: "I" },
    derive: (w) => {
      const code = `${w.letter1}${w.numVal}${w.letter2}`;
      const isTarget = code === "J22I";
      return {
        value: code,
        optionId: isTarget ? matchOption(question, "A") ?? "A" : matchOption(question, "B") ?? "B",
        note: isTarget
          ? "Progression locked: Letter 1 (+2) = J; Number (+6) = 22; Letter 2 (−1) = I. Next term is J22I."
          : `Current reactor output: ${code}. Check step increments (+2, +6, −1).`,
      };
    },
  });

  const rotateLetter1 = (dir: 1 | -1) => {
    const letters = ["F", "G", "H", "I", "J", "K", "L"];
    const idx = letters.indexOf(world.letter1);
    const nextIdx = (idx + dir + letters.length) % letters.length;
    set((w) => ({ ...w, letter1: letters[nextIdx] }));
  };

  const rotateLetter2 = (dir: 1 | -1) => {
    const letters = ["G", "H", "I", "J", "K", "L", "M"];
    const idx = letters.indexOf(world.letter2);
    const nextIdx = (idx + dir + letters.length) % letters.length;
    set((w) => ({ ...w, letter2: letters[nextIdx] }));
  };

  return (
    <PlayShell
      title="Sequence Power Reactor"
      mission="Operate the 3 reactor wheels to generate the 5th term in sequence B4M → D7L → F11K → H16J → ?"
      icon={Zap}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Reactor Term" value={`${world.letter1}${world.numVal}${world.letter2}`} />}
    >
      <div className="space-y-4">
        {/* Reactor Console */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-500/30 shadow-xl text-center">
          <div className="text-xs font-mono font-bold text-cyan-300 mb-2">Sequence Progression Reactor Core</div>
          <div className="flex items-center justify-center gap-4 my-4 font-mono">
            {/* Wheel 1: 1st Letter */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-indigo-300 mb-1">Ch 1: (+2)</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => rotateLetter1(-1)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs"
                >
                  ▲
                </button>
                <div className="w-14 h-16 bg-slate-950 border-2 border-cyan-400 rounded-xl flex items-center justify-center text-3xl font-black text-cyan-300 shadow-inner">
                  {world.letter1}
                </div>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => rotateLetter1(1)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs"
                >
                  ▼
                </button>
              </div>
            </div>

            {/* Wheel 2: Number */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-amber-300 mb-1">Ch 2: (+6)</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => set((w) => ({ ...w, numVal: Math.max(16, w.numVal - 1) }))}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs"
                >
                  −
                </button>
                <div className="w-16 h-16 bg-slate-950 border-2 border-amber-400 rounded-xl flex items-center justify-center text-3xl font-black text-amber-300 shadow-inner">
                  {world.numVal}
                </div>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => set((w) => ({ ...w, numVal: Math.min(30, w.numVal + 1) }))}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Wheel 3: 2nd Letter */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-rose-300 mb-1">Ch 3: (−1)</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => rotateLetter2(-1)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs"
                >
                  ▲
                </button>
                <div className="w-14 h-16 bg-slate-950 border-2 border-rose-400 rounded-xl flex items-center justify-center text-3xl font-black text-rose-300 shadow-inner">
                  {world.letter2}
                </div>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => rotateLetter2(1)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q5 — ⚙️ Mechanical Transformation Machine (Figure Analogy)
   Result: Target Figure C (Option C)
   ══════════════════════════════════════════════════════════════════════ */
interface Q5World {
  rotation: number; // 0, 90, 180, 270
  inverted: boolean;
}

export function B05MechanicalTransformationActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const { world, locked, touched, derived, set, submit, reset } = usePlay<Q5World>({
    question,
    activityState,
    value,
    onChange,
    readOnly,
    initial: { rotation: 90, inverted: true },
    derive: (w) => {
      const isTarget = w.rotation === 90 && w.inverted;
      return {
        value: `Rotation ${w.rotation}° · ${w.inverted ? "Inverted" : "Normal"}`,
        optionId: isTarget ? matchOption(question, "C") ?? "C" : matchOption(question, "A") ?? "A",
        note: isTarget
          ? "Transformation matches Figure (i)→(ii) rule applied onto Figure (iii)."
          : "Adjust the machine's mechanical transformation parameters.",
      };
    },
  });

  return (
    <PlayShell
      title="Mechanical Transformation Machine"
      mission="Apply the mechanical rotation and inversion observed from Figure (i)→(ii) onto Figure (iii) to construct Figure (iv)."
      icon={Cpu}
      dim="3D"
      question={question}
      derived={derived}
      locked={locked}
      touched={touched}
      readOnly={readOnly}
      onSubmit={submit}
      onReset={reset}
      live={<Gauge label="Machine State" value={`${world.rotation}° ${world.inverted ? "Inverted" : ""}`} />}
    >
      <div className="space-y-4">
        {/* Transformation Canvas */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
          <div className="w-48 h-48 bg-white border-2 border-indigo-300 rounded-2xl flex items-center justify-center shadow-inner relative">
            <svg
              viewBox="0 0 100 100"
              className="w-32 h-32 transition-transform duration-300"
              style={{ transform: `rotate(${world.rotation}deg) scaleY(${world.inverted ? -1 : 1})` }}
            >
              {/* Rod Frame */}
              <line x1="20" y1="20" x2="20" y2="80" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" />
              <line x1="80" y1="20" x2="80" y2="80" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" />
              <line x1="20" y1="50" x2="80" y2="50" stroke="#4f46e5" strokeWidth="3" />
              {/* Blocks */}
              <rect x="35" y="30" width="30" height="15" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
              <rect x="35" y="55" width="30" height="15" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Machine Controls */}
          <div className="mt-4 flex gap-2 flex-wrap justify-center">
            {[0, 90, 180, 270].map((deg) => (
              <button
                key={deg}
                type="button"
                disabled={locked}
                onClick={() => set((w) => ({ ...w, rotation: deg }))}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  world.rotation === deg
                    ? "bg-indigo-600 text-white border-indigo-700 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Rotate {deg}°
              </button>
            ))}
            <button
              type="button"
              disabled={locked}
              onClick={() => set((w) => ({ ...w, inverted: !w.inverted }))}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                world.inverted
                  ? "bg-purple-600 text-white border-purple-700 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Toggle Inversion
            </button>
          </div>
        </div>
      </div>
    </PlayShell>
  );
}

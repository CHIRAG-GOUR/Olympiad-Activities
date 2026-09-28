"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Grid3X3, Users, FlipHorizontal, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board, PlayCanvas } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Q11 — The Shape Matrix Core (3×3 Figure Matrix)
   Rows: Square, Circle, Triangle/Diamond.
   Columns: Dot placement count/orientation.
   Candidate slots matching core into missing cell -> Option B.
   ══════════════════════════════════════════════════════════════════════ */

export function Q11ShapeMatrixCoreActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ slottedTile: string | null }>({
    question,
    initial: { slottedTile: null },
    derive: (w) => {
      if (!w.slottedTile) return { note: "Analyze row/column properties and slot the missing figure into cell (3,3)." };
      return { value: `Figure ${w.slottedTile}`, optionId: matchOption(question, w.slottedTile) ?? w.slottedTile };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;

  return (
    <Shell
      play={play}
      question={question}
      title="The 3×3 Shape Matrix Inspector"
      mission="Inspect the 3×3 figure matrix. Row 1 features squares, Row 2 features circles, Row 3 features triangles with progressive internal elements. Slot the correct geometric core into the missing bottom-right cell."
      icon={Grid3X3}
      dim="2D"
      submitLabel="Submit Matrix Figure"
      hints={[
        "Check shape by row: Row 1 = Square, Row 2 = Circle, Row 3 = Triangle.",
        "Check line orientations by column: Col 1 = 1 element, Col 2 = 2 elements, Col 3 = 3 elements with inverted base.",
        "Slotting Candidate B satisfies all dual row and column invariants.",
      ]}
      live={
        <>
          <Gauge label="Inserted Core" value={w.slottedTile ?? "Empty"} tone={w.slottedTile === "B" ? "emerald" : "indigo"} />
        </>
      }
    >
      <Board>
        <div className="w-60 h-60 mx-auto grid grid-cols-3 grid-rows-3 gap-2 p-2.5 bg-slate-100 rounded-2xl border-2 border-indigo-200 shadow-sm">
          {/* Row 1: Squares */}
          <div className="bg-white rounded-xl flex items-center justify-center border border-slate-200 text-indigo-700 font-extrabold text-sm shadow-xs">⬛-1</div>
          <div className="bg-white rounded-xl flex items-center justify-center border border-slate-200 text-indigo-700 font-extrabold text-sm shadow-xs">⬛-2</div>
          <div className="bg-white rounded-xl flex items-center justify-center border border-slate-200 text-indigo-700 font-extrabold text-sm shadow-xs">⬛-3</div>
          {/* Row 2: Circles */}
          <div className="bg-white rounded-xl flex items-center justify-center border border-slate-200 text-sky-700 font-extrabold text-sm shadow-xs">●-1</div>
          <div className="bg-white rounded-xl flex items-center justify-center border border-slate-200 text-sky-700 font-extrabold text-sm shadow-xs">●-2</div>
          <div className="bg-white rounded-xl flex items-center justify-center border border-slate-200 text-sky-700 font-extrabold text-sm shadow-xs">●-3</div>
          {/* Row 3: Triangles */}
          <div className="bg-white rounded-xl flex items-center justify-center border border-slate-200 text-emerald-700 font-extrabold text-sm shadow-xs">▲-1</div>
          <div className="bg-white rounded-xl flex items-center justify-center border border-slate-200 text-emerald-700 font-extrabold text-sm shadow-xs">▲-2</div>
          <div className={`rounded-xl flex items-center justify-center border-2 border-dashed ${w.slottedTile === "B" ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-black" : "border-amber-400 bg-white text-amber-700 font-bold"} text-xs shadow-xs`}>
            {w.slottedTile ? `▲ (${w.slottedTile})` : "Slot ?"}
          </div>
        </div>
      </Board>

      <Bay label="Candidate Cores" tone="indigo">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["A", "B", "C", "D"].map((opt) => (
            <Btn
              key={opt}
              tone={w.slottedTile === opt ? "emerald" : "slate"}
              disabled={play.readOnly}
              onClick={() => play.patch({ slottedTile: opt })}
            >
              Slot Figure {opt}
            </Btn>
          ))}
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q12 — The Family Tree House (Blood Relations)
   Sara = Daughter of Vijay's father's father (Paternal Grandfather).
   Grandfather's daughter = Vijay's Father's sister = Aunt.
   Candidate connects genealogical nodes -> Option A (Aunt).
   ══════════════════════════════════════════════════════════════════════ */

export function Q12FamilyTreeHouseActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ nodesConnected: boolean; relationship: string | null }>({
    question,
    initial: { nodesConnected: false, relationship: null },
    derive: (w) => {
      if (!w.relationship) return { note: "Trace the lineage: Vijay → Father → Grandfather → Daughter (Sara)." };
      return { value: w.relationship, optionId: matchText(question, w.relationship) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;

  return (
    <Shell
      play={play}
      question={question}
      title="The Family Tree Lineage Mapper"
      mission="Vijay points to Sara: 'She is the daughter of my father's father.' Connect the genealogical nodes in the family tree to reveal Sara's exact familial relationship to Vijay."
      icon={Users}
      dim="2D"
      submitLabel="Submit Kinship Relationship"
      hints={[
        "Vijay's father's father = Vijay's paternal grandfather.",
        "The daughter of Vijay's paternal grandfather = Vijay's father's sister.",
        "A father's sister is Vijay's Aunt.",
      ]}
      live={
        <>
          <Gauge label="Kinship Result" value={w.relationship ?? "Unlinked"} tone={w.relationship === "Aunt" ? "emerald" : "indigo"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex flex-col justify-between border border-indigo-100 shadow-xs space-y-3 min-h-[180px]">
          {/* Generation 1: Grandfather */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-violet-50 border border-violet-200 rounded-xl text-violet-900 font-extrabold text-xs">
              👴 Paternal Grandfather ("Father's Father")
            </span>
          </div>

          {/* Connective Lines */}
          <div className="flex justify-around text-slate-500 font-bold text-xs px-8">
            <span>↙ Son</span>
            <span>↘ Daughter</span>
          </div>

          {/* Generation 2: Father & Sara */}
          <div className="flex justify-around items-center">
            <span className="px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 font-extrabold text-xs">
              👨 Vijay's Father
            </span>
            <span className={`px-3 py-1.5 rounded-xl font-extrabold text-xs border ${w.nodesConnected ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
              👩 Sara (Daughter)
            </span>
          </div>

          {/* Generation 3: Vijay */}
          <div className="flex justify-start pl-8">
            <span className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 font-extrabold text-xs">
              👦 Vijay (Son)
            </span>
          </div>
        </div>
      </Board>

      <Bay label="Kinship Deductions" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ nodesConnected: true, relationship: "Aunt" })}>
            🧬 Connect Lineage & Deduce (Aunt)
          </Btn>
          <Btn tone="slate" disabled={play.readOnly} onClick={() => play.patch({ nodesConnected: true, relationship: "Sister" })}>
            Set Sister
          </Btn>
          <Btn tone="slate" disabled={play.readOnly} onClick={() => play.patch({ nodesConnected: true, relationship: "Mother" })}>
            Set Mother
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q13 — The Mirror Dimension (F @ M # L ? Y with left vertical mirror)
   Candidate adjusts reflective mirror plane on LEFT to derive Option B.
   ══════════════════════════════════════════════════════════════════════ */

export function Q13MirrorDimensionActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const original = "F @ M # L ? Y";
  const play = usePlay<{ mirrorPlaced: boolean; reflected: boolean }>({
    question,
    initial: { mirrorPlaced: false, reflected: false },
    derive: (w) => {
      if (!w.reflected) return { note: "Position the optical reflection plane to the LEFT of F @ M # L ? Y." };
      return { value: "Image B", optionId: "B" };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;

  return (
    <Shell
      play={play}
      question={question}
      title="The Optical Mirror Reflection Studio"
      mission="A vertical reflective plane is placed to the LEFT of 'F @ M # L ? Y'. Activate the reflection beam to compute the left-sided geometric inversion of each character."
      icon={FlipHorizontal}
      dim="2D"
      submitLabel="Submit Mirror Image"
      hints={[
        "The mirror is on the LEFT, so the leftmost character 'F' reflects closest to the mirror.",
        "Individual glyphs are horizontally reversed: F becomes ꟻ, @ reverses, L becomes ⅃, ? reverses.",
        "This matches Image B.",
      ]}
      live={
        <>
          <Gauge label="Mirror Position" value={w.mirrorPlaced ? "Left Plane Active" : "Standby"} tone={w.mirrorPlaced ? "emerald" : "indigo"} />
          <Gauge label="Reflection Output" value={w.reflected ? "Image B" : "Unresolved"} tone={w.reflected ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex items-center justify-around border border-indigo-100 shadow-xs min-h-[160px]">
          {/* Left Reflection */}
          {w.reflected ? (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-center">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800 mb-1">Reflected Image (Image B)</div>
              <div className="font-mono text-xl font-black text-emerald-700 tracking-wider">
                Y ? L # M @ F
              </div>
            </div>
          ) : (
            <div className="text-slate-400 font-bold text-xs italic">Awaiting Reflection...</div>
          )}

          {/* Mirror Plane */}
          <div className={`w-1.5 h-28 rounded-full ${w.mirrorPlaced ? "bg-cyan-500 shadow-sm" : "bg-slate-300"}`} />

          {/* Original Glyphs */}
          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-center">
            <div className="text-[10px] font-black uppercase tracking-wider text-indigo-700 mb-1">Original String</div>
            <div className="font-mono text-xl font-black text-slate-800 tracking-wider">
              {original}
            </div>
          </div>
        </div>
      </Board>

      <Bay label="Optical Controls" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="sky" disabled={play.readOnly} onClick={() => play.patch({ mirrorPlaced: true })}>
            🪞 Place Mirror on Left
          </Btn>
          <Btn tone="emerald" disabled={play.readOnly || !w.mirrorPlaced} onClick={() => play.patch({ reflected: true })}>
            ⚡ Generate Reflection (Image B)
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q14 — The Four-Stage Symbol Machine (Continuing Series)
   Rotational progression of problem figures establishes Option C as 5th.
   ══════════════════════════════════════════════════════════════════════ */

export function Q14ContinuingSeriesActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ currentStage: number }>({
    question,
    initial: { currentStage: 1 },
    derive: (w) => {
      if (w.currentStage < 5) return { note: `Advance symbol transformation engine to stage 5.` };
      return { value: "Figure C", optionId: "C" };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;

  return (
    <Shell
      play={play}
      question={question}
      title="The Sequential Figure Progression Wheel"
      mission="Study the 4 sequential transformation panels. The internal dial rotates 45° clockwise while the perimeter pin shifts alternately. Configure and generate the 5th panel in the sequence."
      icon={RefreshCw}
      dim="2D"
      submitLabel="Submit 5th Series Figure"
      hints={[
        "Arrow rotation: 0° → 45° → 90° → 135° → Stage 5 will point at 180° (South).",
        "Pin alternation: top-right → bottom-left → top-left → bottom-right → Stage 5 pin is at top-right.",
        "Figure C is the exact 5th continuation.",
      ]}
      live={
        <>
          <Gauge label="Sequence Stage" value={`Panel ${w.currentStage}/5`} tone={w.currentStage === 5 ? "emerald" : "indigo"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex items-center justify-around border border-indigo-100 shadow-xs flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((stage) => (
            <div
              key={stage}
              className={`w-14 h-20 rounded-xl border p-1 text-center flex flex-col items-center justify-between transition-all ${w.currentStage === stage ? "border-emerald-500 bg-emerald-50 shadow-xs" : stage < w.currentStage ? "border-indigo-300 bg-indigo-50/40" : "border-slate-200 bg-slate-50"}`}
            >
              <span className="text-[10px] font-black text-slate-600">P-{stage}</span>
              <div
                className="w-8 h-8 rounded-full border-2 border-indigo-400 bg-white flex items-center justify-center transition-transform shadow-xs"
                style={{ transform: `rotate(${(stage - 1) * 45}deg)` }}
              >
                <div className="w-1 h-4 bg-indigo-600 rounded-full" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-700">{stage === 5 ? "(Fig C)" : `${(stage - 1) * 45}°`}</span>
            </div>
          ))}
        </div>
      </Board>

      <Bay label="Series Progression" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="slate" disabled={play.readOnly || w.currentStage <= 1} onClick={() => play.patch({ currentStage: w.currentStage - 1 })}>
            ◀ Previous Panel
          </Btn>
          <Btn tone="indigo" disabled={play.readOnly || w.currentStage >= 5} onClick={() => play.patch({ currentStage: w.currentStage + 1 })}>
            Next Panel ▶
          </Btn>
          <Btn tone="emerald" disabled={play.readOnly} onClick={() => play.patch({ currentStage: 5 })}>
            🎯 Complete Series (Figure C)
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q15 — The Transformation Forge (Figure Analogy)
   Left pair rule: Vertically invert outer shape and shade inner component.
   Apply same rule to right figure -> produces Figure C.
   ══════════════════════════════════════════════════════════════════════ */

export function Q15TransformationForgeActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const play = usePlay<{ ruleDiscovered: boolean; transformed: boolean }>({
    question,
    initial: { ruleDiscovered: false, transformed: false },
    derive: (w) => {
      if (!w.transformed) return { note: "Discover rule from left pair and execute forge on Figure 3." };
      return { value: "Figure C", optionId: "C" };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });

  const w = play.world;

  return (
    <Shell
      play={play}
      question={question}
      title="The Geometric Analogy Studio"
      mission="Discover the mathematical transformation rule from Figure 1 :: Figure 2 (vertical reflection + shading inversion). Apply the forged rule to Figure 3 to produce the missing fourth analogue (Figure C)."
      icon={Sparkles}
      dim="2D"
      submitLabel="Submit Analogy Figure"
      hints={[
        "Figure 1 (Triangle containing hollow circle) becomes Figure 2 (Inverted triangle containing solid shaded circle).",
        "Figure 3 (Pentagon containing hollow square) must become Inverted pentagon containing solid shaded square.",
        "Figure C matches this exact rule.",
      ]}
      live={
        <>
          <Gauge label="Rule Extracted" value={w.ruleDiscovered ? "Invert + Shade" : "Pending"} tone={w.ruleDiscovered ? "emerald" : "amber"} />
          <Gauge label="Analogue Output" value={w.transformed ? "Figure C" : "Unforged"} tone={w.transformed ? "emerald" : "slate"} />
        </>
      }
    >
      <Board>
        <div className="w-full bg-white rounded-xl p-4 flex items-center justify-around border border-indigo-100 shadow-xs flex-wrap gap-2 min-h-[160px]">
          {/* Pair 1 */}
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 bg-slate-50 rounded-xl border border-indigo-200 flex items-center justify-center shadow-xs">
              <span className="text-2xl">▲○</span>
            </div>
            <span className="text-slate-400 font-bold">:</span>
            <div className="w-16 h-16 bg-indigo-50 rounded-xl border border-emerald-300 flex items-center justify-center shadow-xs">
              <span className="text-2xl text-emerald-700">▼●</span>
            </div>
          </div>

          <span className="text-indigo-600 font-black text-xl">::</span>

          {/* Pair 2 */}
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 bg-slate-50 rounded-xl border border-indigo-200 flex items-center justify-center shadow-xs">
              <span className="text-2xl">⬟□</span>
            </div>
            <span className="text-slate-400 font-bold">:</span>
            <div className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center shadow-xs transition-all ${w.transformed ? "bg-emerald-50 border-emerald-400" : "bg-slate-50 border-dashed border-slate-300"}`}>
              <span className={`text-2xl ${w.transformed ? "text-emerald-700 font-bold" : "text-slate-400"}`}>{w.transformed ? "⯝■" : "?"}</span>
            </div>
          </div>
        </div>
      </Board>

      <Bay label="Analogy Operations" tone="indigo">
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="violet" disabled={play.readOnly} onClick={() => play.patch({ ruleDiscovered: true })}>
            🔍 Extract Analogy Rule
          </Btn>
          <Btn tone="emerald" disabled={play.readOnly || !w.ruleDiscovered} onClick={() => play.patch({ transformed: true })}>
            ⚡ Forge 4th Analogue (Figure C)
          </Btn>
        </div>
      </Bay>
    </Shell>
  );
}

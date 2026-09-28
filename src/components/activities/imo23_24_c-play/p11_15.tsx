"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Grid3X3, Users, FlipHorizontal, RefreshCw, Sparkles } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchText, matchOption } from "../imo6a/shared";
import { usePlay } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Shell, Board } from "./kit";

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
      title="The Holographic Matrix Core"
      mission="Inspect the 3×3 figure matrix. Row 1 features squares, Row 2 features circles, Row 3 features triangles with varying internal/external line elements. Slot the correct geometric core into the missing cell."
      icon={Grid3X3}
      dim="2D"
      submitLabel="Submit Matrix Figure"
      hints={[
        "Check shape by row: Row 1 = Square, Row 2 = Circle, Row 3 = Triangle.",
        "Check line orientations by column: Col 1 = Vertical, Col 2 = Horizontal, Col 3 = Inverted T with dots.",
        "Slotting Candidate B satisfies all dual row and column invariants.",
      ]}
      live={
        <>
          <Gauge label="Inserted Core" value={w.slottedTile ?? "Empty"} tone={w.slottedTile === "B" ? "emerald" : "indigo"} />
        </>
      }
    >
      <Board>
        <div className="w-56 h-56 mx-auto grid grid-cols-3 grid-rows-3 gap-1.5 p-2 bg-slate-900 rounded-2xl border-2 border-indigo-500 shadow-lg">
          {/* Row 1: Squares */}
          <div className="bg-indigo-950/80 rounded-lg flex items-center justify-center border border-indigo-700 text-sky-400 font-bold text-xs">⬛-1</div>
          <div className="bg-indigo-950/80 rounded-lg flex items-center justify-center border border-indigo-700 text-sky-400 font-bold text-xs">⬛-2</div>
          <div className="bg-indigo-950/80 rounded-lg flex items-center justify-center border border-indigo-700 text-sky-400 font-bold text-xs">⬛-3</div>
          {/* Row 2: Circles */}
          <div className="bg-indigo-950/80 rounded-lg flex items-center justify-center border border-indigo-700 text-violet-400 font-bold text-xs">●-1</div>
          <div className="bg-indigo-950/80 rounded-lg flex items-center justify-center border border-indigo-700 text-violet-400 font-bold text-xs">●-2</div>
          <div className="bg-indigo-950/80 rounded-lg flex items-center justify-center border border-indigo-700 text-violet-400 font-bold text-xs">●-3</div>
          {/* Row 3: Triangles */}
          <div className="bg-indigo-950/80 rounded-lg flex items-center justify-center border border-indigo-700 text-emerald-400 font-bold text-xs">▲-1</div>
          <div className="bg-indigo-950/80 rounded-lg flex items-center justify-center border border-indigo-700 text-emerald-400 font-bold text-xs">▲-2</div>
          <div className={`rounded-lg flex items-center justify-center border-2 border-dashed ${w.slottedTile === "B" ? "border-emerald-400 bg-emerald-950 text-emerald-300 font-black" : "border-amber-400 bg-slate-800 text-amber-300 font-bold"} text-xs`}>
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
      return { value: w.relationship, optionId: matchText(question, w.relationship) ?? "A" };
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
      title="The Family Tree House"
      mission="Vijay points to Sara: 'She is the daughter of my father's father.' Connect the genealogical nodes in the family tree house to reveal Sara's exact familial relationship to Vijay."
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
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex flex-col justify-between border border-slate-700">
          {/* Generation 1: Grandfather */}
          <div className="text-center">
            <span className="px-3 py-1 bg-violet-950 border border-violet-500 rounded-lg text-violet-300 font-bold text-xs">
              👴 Paternal Grandfather ("Father's Father")
            </span>
          </div>

          {/* Connective Lines */}
          <div className="flex justify-around text-slate-500 font-black text-xs">
            <span>↙ Son</span>
            <span>↘ Daughter</span>
          </div>

          {/* Generation 2: Father & Sara */}
          <div className="flex justify-around">
            <span className="px-3 py-1 bg-sky-950 border border-sky-500 rounded-lg text-sky-300 font-bold text-xs">
              👨 Vijay's Father
            </span>
            <span className={`px-3 py-1 rounded-lg font-bold text-xs border ${w.nodesConnected ? "bg-emerald-950 border-emerald-400 text-emerald-300" : "bg-slate-800 border-slate-600 text-slate-400"}`}>
              👩 Sara (Daughter)
            </span>
          </div>

          {/* Generation 3: Vijay */}
          <div className="flex justify-start pl-8">
            <span className="px-3 py-1 bg-indigo-950 border border-indigo-500 rounded-lg text-indigo-300 font-bold text-xs">
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
      title="The Mirror Dimension"
      mission="A vertical reflective plane is placed to the LEFT of 'F @ M # L ? Y'. Activate the reflection beam to compute the left-sided geometric inversion of each engraved glyph."
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
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex items-center justify-around border border-slate-700">
          {/* Left Reflection */}
          {w.reflected ? (
            <div className="p-3 bg-indigo-950/80 rounded-xl border border-emerald-400 text-center">
              <div className="text-[10px] font-bold text-emerald-400 mb-1">REFLECTED IMAGE (Image B)</div>
              <div className="font-mono text-xl font-black text-emerald-300 tracking-wider">
                Y ? L # M @ F
              </div>
            </div>
          ) : (
            <div className="text-slate-500 font-bold text-xs italic">Awaiting Reflection...</div>
          )}

          {/* Mirror Plane */}
          <div className={`w-1.5 h-32 rounded-full ${w.mirrorPlaced ? "bg-cyan-400 shadow-[0_0_15px_#22d3ee]" : "bg-slate-700"}`} />

          {/* Original Glyphs */}
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-600 text-center">
            <div className="text-[10px] font-bold text-slate-400 mb-1">ORIGINAL OBJECT</div>
            <div className="font-mono text-xl font-black text-sky-400 tracking-wider">
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
      title="The Four-Stage Symbol Machine"
      mission="Study the 4 sequential transformation panels. The internal arrow rotates 45° clockwise while the perimeter pin shifts alternately. Configure and generate the 5th panel in the sequence."
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
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex items-center justify-around border border-slate-700">
          {[1, 2, 3, 4, 5].map((stage) => (
            <div
              key={stage}
              className={`w-14 h-16 rounded-xl border p-1 text-center flex flex-col items-center justify-between ${w.currentStage === stage ? "border-emerald-400 bg-emerald-950/70" : stage < w.currentStage ? "border-indigo-500 bg-indigo-950/40" : "border-slate-700 bg-slate-800"}`}
            >
              <span className="text-[9px] font-bold text-slate-400">P-{stage}</span>
              <div
                className="w-7 h-7 rounded-full border border-sky-400 flex items-center justify-center transition-transform"
                style={{ transform: `rotate(${(stage - 1) * 45}deg)` }}
              >
                <div className="w-0.5 h-3.5 bg-sky-300 rounded-full" />
              </div>
              <span className="text-[9px] font-mono text-slate-300">{stage === 5 ? "(C)" : `${(stage - 1) * 45}°`}</span>
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
      title="The Analogy Transformation Forge"
      mission="Discover the mathematical transformation rule from Figure 1 :: Figure 2 (vertical reflection + shading inversion). Apply the forged rule to Figure 3 to produce the missing fourth analogue."
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
        <div className="w-full h-44 bg-slate-900 rounded-xl p-3 flex items-center justify-around border border-slate-700">
          {/* Pair 1 */}
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 bg-slate-800 rounded-xl border border-indigo-400 flex items-center justify-center">
              <span className="text-xl">▲○</span>
            </div>
            <span className="text-slate-400 font-bold">:</span>
            <div className="w-16 h-16 bg-indigo-950 rounded-xl border border-emerald-400 flex items-center justify-center">
              <span className="text-xl">▼●</span>
            </div>
          </div>

          <span className="text-amber-400 font-black text-lg">::</span>

          {/* Pair 2 */}
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 bg-slate-800 rounded-xl border border-indigo-400 flex items-center justify-center">
              <span className="text-xl">⬟□</span>
            </div>
            <span className="text-slate-400 font-bold">:</span>
            <div className={`w-16 h-16 rounded-xl border flex items-center justify-center ${w.transformed ? "bg-emerald-950 border-emerald-400" : "bg-slate-800 border-dashed border-slate-600"}`}>
              <span className="text-xl">{w.transformed ? "⯝■" : "?"}</span>
            </div>
          </div>
        </div>
      </Board>

      <Bay label="Forge Operations" tone="indigo">
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

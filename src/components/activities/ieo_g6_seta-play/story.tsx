"use client";

import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Delete, Flag, GripVertical, Highlighter, LucideIcon, Type } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, World3D } from "./kit";

/* ══════════════════════════════════════════════════════════════════════
   Story engine for the English paper.

   Every question is a small world that acts out its sentence. The student
   never ticks an option: they drag (or tap-then-place) a word tile into the
   gap of the sentence the characters are saying, plant a flag on the faulty
   part of a sentence, type a word on the spelling machine, or mark the line
   of a passage that backs up their answer before placing the answer card.

   Which option a tile stands for is only looked up when the answer is
   recorded; nothing on screen reacts differently to the right choice.
   ══════════════════════════════════════════════════════════════════════ */

type V3 = [number, number, number];

export interface WorldProps {
  /** The text in the sentence's gap (or null while it is empty). */
  word: string | null;
  /** True once the student has completed the sentence. */
  filled: boolean;
}

type Mechanic =
  | { kind: "fill"; template: string; speaker?: string }
  | { kind: "error"; before?: string }
  | { kind: "spell"; meaning: string }
  | { kind: "reading"; passage: string; prompt: string; template?: string };

export interface StorySpec {
  title: string;
  mission: string;
  hints: string[];
  icon?: LucideIcon;
  World: React.ComponentType<WorldProps>;
  camera?: { position: V3; fov?: number; target?: V3 };
  sky?: string;
  ground?: string;
  /** Where the speech bubble floats in the world. */
  bubbleAt?: V3;
  mech: Mechanic;
}

type StoryWorld = { placed?: string; typed?: string; marks?: number[] };

/* ── drag or tap-to-place ────────────────────────────────────────────── */

type DragApi = { held: string | null; hold: (id: string | null) => void; drop: (slot: string) => void; locked: boolean };
const DragCtx = createContext<DragApi>({ held: null, hold: () => {}, drop: () => {}, locked: false });

function DragProvider({ onDrop, locked, children }: { onDrop: (tile: string, slot: string) => void; locked: boolean; children: React.ReactNode }) {
  const [held, setHeld] = useState<string | null>(null);
  const api = useMemo<DragApi>(
    () => ({
      held,
      locked,
      hold: (id) => setHeld((h) => (h === id ? null : id)),
      drop: (slot) => {
        if (held !== null) onDrop(held, slot);
        setHeld(null);
      },
    }),
    [held, locked, onDrop]
  );
  return <DragCtx.Provider value={api}>{children}</DragCtx.Provider>;
}

/** A word tile: drag it onto a gap, or tap it and then tap the gap. */
export function Tile({ id, label, tone = "violet", big = false }: { id: string; label: string; tone?: "violet" | "amber" | "rose" | "sky"; big?: boolean }) {
  const { held, hold, drop, locked } = useContext(DragCtx);
  const [ghost, setGhost] = useState<{ x: number; y: number } | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const toneCls = {
    violet: "bg-white border-violet-300 text-violet-900 shadow-[0_3px_0_#c4b5fd]",
    amber: "bg-white border-amber-300 text-amber-900 shadow-[0_3px_0_#fcd34d]",
    rose: "bg-white border-rose-300 text-rose-900 shadow-[0_3px_0_#fda4af]",
    sky: "bg-white border-sky-300 text-sky-900 shadow-[0_3px_0_#7dd3fc]",
  }[tone];
  const isHeld = held === id;
  return (
    <>
      <button
        type="button"
        aria-label={`tile ${label}`}
        disabled={locked}
        onPointerDown={(e) => {
          start.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerMove={(e) => {
          if (!start.current || locked) return;
          if (!ghost && Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > 8) {
            (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
            if (held !== id) hold(id);
          }
          if (ghost || Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > 8) setGhost({ x: e.clientX, y: e.clientY });
        }}
        onPointerUp={(e) => {
          const wasDrag = !!ghost;
          start.current = null;
          setGhost(null);
          if (!wasDrag) return;
          const el = document.elementsFromPoint(e.clientX, e.clientY).map((n) => (n as HTMLElement).closest?.("[data-drop]")).find(Boolean) as HTMLElement | undefined;
          if (el?.dataset.drop) drop(el.dataset.drop);
          else hold(null);
        }}
        onClick={() => {
          if (!ghost) hold(id);
        }}
        className={`relative inline-flex items-center gap-1.5 rounded-xl border-2 px-3 ${big ? "py-2.5 text-base" : "py-1.5 text-sm"} font-bold transition-all select-none touch-none ${toneCls} ${
          isHeld ? "-translate-y-1 ring-4 ring-amber-300" : "hover:-translate-y-0.5"
        } disabled:opacity-60`}
      >
        <GripVertical className="h-3.5 w-3.5 opacity-40" />
        {label}
      </button>
      {ghost && (
        <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-violet-400 bg-white px-3 py-1.5 text-sm font-bold text-violet-900 shadow-xl" style={{ left: ghost.x, top: ghost.y }}>
          {label}
        </div>
      )}
    </>
  );
}

/** A gap a tile can be dropped into. */
function Gap({ slot, children, filled, label = "sentence gap", wide = false }: { slot: string; children: React.ReactNode; filled: boolean; label?: string; wide?: boolean }) {
  const { held, drop, locked } = useContext(DragCtx);
  return (
    <button
      type="button"
      data-drop={slot}
      aria-label={label}
      disabled={locked}
      onClick={() => drop(slot)}
      className={`mx-1 inline-flex items-center justify-center rounded-lg border-2 px-2.5 py-0.5 align-middle font-bold transition-all ${wide ? "min-w-[160px]" : "min-w-[88px]"} ${
        filled ? "border-violet-400 bg-violet-100 text-violet-900" : held ? "animate-pulse border-dashed border-amber-400 bg-amber-50 text-amber-700" : "border-dashed border-slate-300 bg-white text-slate-400"
      }`}
    >
      {children}
    </button>
  );
}

/** Splits "a ___ b" into the text either side of the gap. */
function splitTemplate(t: string): [string, string] {
  const i = t.indexOf("___");
  return i < 0 ? [t + " ", ""] : [t.slice(0, i), t.slice(i + 3)];
}

/** What goes in each gap. A two-gap sentence takes a pair tile such as "No article, an". */
function gapWords(template: string, word: string | null): (string | null)[] {
  const gaps = template.split("___").length - 1;
  if (gaps <= 1) return [word];
  const parts = word ? word.split(/,\s*/) : [];
  return Array.from({ length: gaps }, (_, i) => (parts[i] === undefined ? null : /^no article$/i.test(parts[i]) ? "Ø" : parts[i]));
}

/** The sentence with its gaps filled (or shown as blanks). */
function fillTemplate(template: string, word: string | null) {
  const parts = template.split("___");
  const words = gapWords(template, word);
  return parts.map((p, i) => (i < words.length ? p + (words[i] ?? "______") : p)).join("").replace(/\s+/g, " ").trim();
}

/** "auto" templates come from the question itself: its blank becomes the gap. */
function resolveTemplate(template: string, questionText?: string) {
  if (template !== "auto") return template;
  return (questionText ?? "___").split(/\n+/).map((l) => l.trim()).filter(Boolean).join(" ").replace(/_{3,}/g, "___");
}

/** Keeps a DOM element pinned above a point in the 3D world. */
function Anchor({ at, target }: { at: V3; target: React.RefObject<HTMLDivElement | null> }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const el = target.current;
    if (!el) return;
    v.set(at[0], at[1], at[2]).project(camera);
    const bw = el.offsetWidth || 200;
    const bh = el.offsetHeight || 60;
    // keep the whole bubble inside the scene frame
    const x = Math.min(size.width - bw / 2 - 8, Math.max(bw / 2 + 8, ((v.x + 1) / 2) * size.width));
    const y = Math.min(size.height - 8, Math.max(bh + 8, ((1 - v.y) / 2) * size.height));
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`;
    el.style.opacity = v.z < 1 ? "1" : "0";
  });
  return null;
}

/** The sentence as a speech bubble floating in the world. */
function Bubble({ text, who, innerRef }: { text: string; who?: string; innerRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={innerRef} className="pointer-events-none absolute left-0 top-0 z-10" style={{ transform: "translate(-9999px, 0)" }}>
      <div className="relative w-max max-w-[250px] rounded-2xl border-2 border-violet-200 bg-white/95 px-2.5 py-1.5 text-[11.5px] font-bold leading-snug text-slate-800 shadow-lg">
        {who && <div className="mb-0.5 text-[10px] font-black uppercase tracking-wide text-violet-500">{who}</div>}
        {text}
        <div className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-violet-200 bg-white" />
      </div>
    </div>
  );
}

/* ── the activity ────────────────────────────────────────────────────── */

const KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function StoryActivity({ spec, question, value, activityState, onChange, readOnly }: ActivityComponentProps & { spec: StorySpec }) {
  const options = question?.multipleChoiceConfig?.options ?? [];
  const byId = (id?: string) => options.find((o) => o.id === id);
  const m = spec.mech;

  const play = usePlay<StoryWorld>({
    question,
    initial: { marks: [] },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (m.kind === "spell") {
        const typed = (w.typed ?? "").trim();
        if (!typed) return { note: "Type the word on the spelling machine." };
        const hit = options.find((o) => o.text.trim().toLowerCase() === typed.toLowerCase());
        return hit ? { value: typed, optionId: hit.id } : { value: typed, note: "The machine only stamps a spelling from its label list — check each letter." };
      }
      if (m.kind === "reading" && !(w.marks ?? []).length) return { note: "Mark the line of the passage that backs up your answer." };
      const o = byId(w.placed);
      if (!o) return { note: m.kind === "error" ? "Plant the flag on the part of the sentence that has the mistake." : "Drag a tile into the gap." };
      return { value: o.text, optionId: o.id };
    },
  });
  const w = play.world;
  const bubbleRef = useRef<HTMLDivElement>(null);
  const placed = byId(w.placed);
  const word = m.kind === "spell" ? (w.typed || null) : placed?.text ?? null;

  const template = m.kind === "fill" ? resolveTemplate(m.template, question?.questionText) : m.kind === "reading" ? m.template : undefined;
  const bubbleText = (() => {
    if (template) return fillTemplate(template, word);
    if (m.kind === "error") return options.map((o) => o.text).join(" ");
    if (m.kind === "spell") return word ? `${word}!` : "…";
    return null;
  })();

  const onDrop = (tile: string, slot: string) => {
    if (m.kind === "error") play.set((p) => ({ ...p, placed: slot }));
    else play.set((p) => ({ ...p, placed: tile }));
  };

  return (
    <Shell dim="3D" play={play} question={question} title={spec.title} subtitle={spec.mission} icon={spec.icon} hints={spec.hints}>
      <DragProvider onDrop={onDrop} locked={play.locked}>
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl border-2 border-violet-100">
            <World3D cue={w.placed ?? w.typed ?? null} camera={spec.camera ?? { position: [0, 2.0, 4.6], fov: 45 }} target={spec.camera?.target ?? [0, 0.95, 0]} height="320px" sky={spec.sky} ground={spec.ground}>
              <spec.World word={word} filled={!!word} />
              {bubbleText && spec.bubbleAt && <Anchor at={spec.bubbleAt} target={bubbleRef} />}
            </World3D>
            {bubbleText && spec.bubbleAt && <Bubble innerRef={bubbleRef} text={bubbleText} who={m.kind === "fill" ? m.speaker : undefined} />}
          </div>

          {m.kind === "fill" && <FillPanel template={template!} speaker={m.speaker} word={word} options={options} />}
          {m.kind === "error" && <ErrorPanel before={m.before} options={options} flagged={w.placed} />}
          {m.kind === "spell" && (
            <SpellPanel
              meaning={m.meaning}
              options={options}
              typed={w.typed ?? ""}
              locked={play.locked}
              onType={(t) => play.set((p) => ({ ...p, typed: t }))}
            />
          )}
          {m.kind === "reading" && (
            <ReadingPanel
              passage={m.passage}
              prompt={m.prompt}
              template={m.template}
              options={options}
              marks={w.marks ?? []}
              word={word}
              locked={play.locked}
              onMark={(i) =>
                play.set((p) => {
                  const cur = p.marks ?? [];
                  return { ...p, marks: cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i] };
                })
              }
            />
          )}
        </div>
      </DragProvider>
    </Shell>
  );
}

/* ── panels ──────────────────────────────────────────────────────────── */

type Opt = { id: string; text: string };

function FillPanel({ template, speaker, word, options }: { template: string; speaker?: string; word: string | null; options: Opt[] }) {
  const parts = template.split("___");
  const words = gapWords(template, word);
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border-2 border-violet-100 bg-gradient-to-br from-violet-50 to-sky-50 p-4 text-center">
        {speaker && <div className="mb-1 text-[11px] font-black uppercase tracking-wide text-violet-500">{speaker}</div>}
        <p className="text-base font-bold leading-relaxed text-slate-800 sm:text-lg">
          {parts.map((p, i) => (
            <React.Fragment key={i}>
              {p}
              {i < words.length && (
                <Gap slot="gap" filled={!!word} label={i === 0 ? "sentence gap" : `sentence gap ${i + 1}`}>
                  {words[i] ?? "drop here"}
                </Gap>
              )}
            </React.Fragment>
          ))}
        </p>
      </div>
      <TileTray options={options} />
    </div>
  );
}

function TileTray({ options, tone = "violet" }: { options: Opt[]; tone?: "violet" | "amber" | "rose" | "sky" }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/70 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
        <Type className="h-3.5 w-3.5" /> Word tiles — drag one into the gap, or tap it and then tap the gap
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {options.map((o) => (
          <Tile key={o.id} id={o.id} label={o.text} tone={tone} big />
        ))}
      </div>
    </div>
  );
}

function ErrorPanel({ before, options, flagged }: { before?: string; options: Opt[]; flagged?: string }) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border-2 border-rose-100 bg-rose-50/60 p-4">
        {before && <p className="mb-2 text-xs font-semibold text-rose-700">{before}</p>}
        <p className="flex flex-wrap items-center justify-center gap-y-2 text-base font-bold text-slate-800">
          {options.map((o) => (
            <Gap key={o.id} slot={o.id} filled={flagged === o.id} label={`part ${o.text}`} wide>
              {flagged === o.id && <Flag className="mr-1 h-4 w-4 text-rose-600" />}
              {o.text}
            </Gap>
          ))}
        </p>
      </div>
      <div className="flex justify-center">
        <Tile id="flag" label="🚩 error flag" tone="rose" big />
      </div>
    </div>
  );
}

function SpellPanel({ meaning, options, typed, onType, locked }: { meaning: string; options: Opt[]; typed: string; onType: (t: string) => void; locked: boolean }) {
  const key = (k: string) => !locked && onType((typed + k).slice(0, 18));
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border-2 border-sky-100 bg-sky-50/70 p-4">
        <p className="text-center text-sm font-semibold text-sky-900">
          The word that means <span className="font-black">‘{meaning}’</span>
        </p>
        <div className="mt-2 flex min-h-[48px] items-center justify-center rounded-xl border-2 border-sky-300 bg-white px-3 font-mono text-2xl font-black tracking-wider text-slate-800" aria-label="machine display">
          {typed ? typed.charAt(0).toUpperCase() + typed.slice(1).toLowerCase() : <span className="text-sm font-bold text-slate-300">type the spelling</span>}
          {!locked && <span className="ml-0.5 animate-pulse text-sky-400">|</span>}
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {options.map((o) => (
            <span key={o.id} className="rounded-lg border border-sky-200 bg-white px-2 py-0.5 font-mono text-xs text-sky-800">
              {o.text}
            </span>
          ))}
        </div>
        <p className="mt-1 text-center text-[10px] font-semibold text-sky-600">The machine can stamp one of these spellings — type the right one letter by letter.</p>
      </div>
      <div className="mx-auto grid max-w-[520px] grid-cols-9 gap-1">
        {KEYS.map((k) => (
          <button key={k} type="button" aria-label={`key ${k}`} disabled={locked} onClick={() => key(k.toLowerCase())} className="h-9 rounded-lg border-2 border-slate-200 bg-white font-mono text-sm font-black text-slate-700 shadow-[0_2px_0_#e2e8f0] active:translate-y-0.5">
            {k}
          </button>
        ))}
        <button type="button" aria-label="key backspace" disabled={locked} onClick={() => onType(typed.slice(0, -1))} className="col-span-1 flex h-9 items-center justify-center rounded-lg border-2 border-slate-200 bg-slate-50 text-slate-600">
          <Delete className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ReadingPanel({ passage, prompt, template, options, marks, word, onMark, locked }: { passage: string; prompt: string; template?: string; options: Opt[]; marks: number[]; word: string | null; onMark: (i: number) => void; locked: boolean }) {
  const [title, ...paras] = passage.trim().split(/\n\s*\n/);
  let k = 0;
  const [a, b] = splitTemplate(template ?? `${prompt} ___`);
  return (
    <div className="grid gap-3 lg:grid-cols-[1.25fr_1fr]">
      <div className="max-h-[360px] overflow-auto rounded-2xl border-2 border-amber-100 bg-amber-50/50 p-4">
        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-600">
          <Highlighter className="h-3.5 w-3.5" /> Tap a line to mark it as your evidence
        </div>
        <h4 className="mb-2 text-center font-black text-slate-800">{title.trim()}</h4>
        {paras.map((p, pi) => (
          <p key={pi} className="mb-2 text-[13px] leading-relaxed text-slate-700">
            {p
              .trim()
              .split(/(?<=[.!?])\s+/)
              .map((sent) => {
                const i = k++;
                const on = marks.includes(i);
                return (
                  <button key={i} type="button" aria-label={`line ${i + 1}`} disabled={locked} onClick={() => onMark(i)} className={`mr-1 inline rounded px-0.5 text-left transition-colors ${on ? "bg-yellow-200 font-semibold text-slate-900" : "hover:bg-amber-100"}`}>
                    {sent}
                  </button>
                );
              })}
          </p>
        ))}
      </div>
      <div className="space-y-3">
        <div className="rounded-2xl border-2 border-violet-100 bg-violet-50/60 p-4 text-center">
          <div className="mb-1 text-[10px] font-black uppercase tracking-wider text-violet-500">{marks.length ? `${marks.length} line${marks.length > 1 ? "s" : ""} marked` : "No evidence marked yet"}</div>
          <p className="text-sm font-bold leading-relaxed text-slate-800">
            {a}
            <Gap slot="gap" filled={!!word} wide>
              {word ?? "drop the answer card"}
            </Gap>
            {b}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {options.map((o) => (
            <Tile key={o.id} id={o.id} label={o.text} tone="amber" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Wraps a spec as an activity component. */
export function makeStory(spec: StorySpec, name: string) {
  const C = (props: ActivityComponentProps) => <StoryActivity spec={spec} {...props} />;
  C.displayName = name;
  return C;
}

"use client";

import React, { useRef, useState } from "react";
import {
  ArrowDown, ArrowUp, Check, Delete, Flag, Hammer, Highlighter, Link2, LucideIcon, MousePointerClick, Pin, Search, Sparkles, Undo2,
} from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { usePlay, type Derived } from "../imo6a-play/engine";
import { Shell, World3D } from "../ieo_g6_seta-play/kit";
import { Anchor, Bubble } from "../ieo_g6_seta-play/story";

/* ══════════════════════════════════════════════════════════════════════
   Language lab engine — IEO Class 6 Set B, Paper 3.

   One engine, many machines. Each question picks the machine that fits
   what the question asks the student to do:

     assemble   WordAssemblyEngine / SentenceBuilderEngine — build the phrase
                from loose word (or word-part) blocks, in order
     drum       GrammarSimulationEngine — spin a word drum on a machine
     punctuate  PunctuationEngine — key the marks into the sentence
     repair     ErrorRepairEngine — inspect the sentence, flag the faulty
                part and rewrite it
     build      SpellingEngine — spell the word from syllable blocks or keys
     scale      TimelineEngine — slide a marker along a time or level scale
     evidence   ReadingInvestigationEngine — collect lines of the passage as
                evidence, then set the conclusion on the pedestal
     badge      VocabularyEngine — pin a word plaque onto what the scene shows
     link       ConnectorEngine — thread the connector that joins two ideas

   Achievers questions add a `gate`: a short task inside the world (test the
   materials, steady the machine, cross the storm) that has to be done before
   the answer can be recorded. The gate never depends on the answer.

   What the student builds is only compared with the printed options when
   the answer is derived; nothing on screen reacts differently to the right
   answer. The world acts out whatever sentence the student has made.
   ══════════════════════════════════════════════════════════════════════ */

type V3 = [number, number, number];

export interface LabWorldProps {
  /** What the student's build currently says (null while nothing is built). */
  word: string | null;
  /** True once something complete is in place. */
  filled: boolean;
  /** True once the answer is submitted. */
  locked: boolean;
  /** State the world itself keeps (achiever tasks, tested samples). */
  extra: Record<string, unknown>;
  /** Lets the world record an interaction. */
  poke: (key: string, value: unknown) => void;
}

export type Stop = { option: string; at: number; label?: string };

export type Mech =
  | { kind: "assemble"; blocks: string[]; tray?: string }
  | { kind: "drum"; machine: string }
  | { kind: "punctuate"; marks: string[]; slots?: number; before: string; after: string }
  | { kind: "repair"; inspectHint?: string }
  | { kind: "build"; blocks: string[] | "keyboard"; meaning: string }
  | { kind: "scale"; shape?: "line" | "ring" | "gauge"; stops: Stop[]; from?: string; to?: string; ticks?: { at: number; label: string }[]; unit?: string }
  | { kind: "evidence"; ask: string; pedestal?: string; chain?: boolean }
  | { kind: "badge"; target: string; verb?: string }
  | { kind: "link"; left: string; right: string };

export type Gate = { title: string; steps: { id: string; label: string; action: string }[] };

export interface LabSpec {
  engine: string;
  title: string;
  mission: string;
  hints: string[];
  icon?: LucideIcon;
  World: React.ComponentType<LabWorldProps>;
  camera?: { position: V3; fov?: number; target?: V3 };
  sky?: string;
  ground?: string;
  /** Where the speech bubble floats in the world. */
  bubbleAt?: V3;
  /** The sentence the machine completes. "auto" (default) takes it from the question. */
  template?: string;
  mech: Mech;
  gate?: Gate;
}

type LabState = { seq: string[]; pick?: string; marks: number[]; flag?: string; fix?: string; extra: Record<string, unknown> };

type Opt = { id: string; text: string };

/* ── text helpers ───────────────────────────────────────────────────── */

const normText = (s: string) =>
  s
    .toLowerCase()
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

/** Joins blocks; a block written "+ive" attaches to the one before it with no space. */
export function joinBlocks(blocks: string[]) {
  return blocks.reduce((s, b) => (b.startsWith("+") ? s + b.slice(1) : s ? `${s} ${b}` : b), "");
}

const showBlock = (b: string) => (b.startsWith("+") ? `‑${b.slice(1)}` : b);

/** The sentence the machine completes, with its blank marked as ___. */
function sentenceOf(spec: LabSpec, questionText?: string) {
  const t = spec.template && spec.template !== "auto" ? spec.template : questionText ?? "";
  return t.replace(/_{3,}/g, "___");
}

/** Splits a conversation into [speaker, line] rows. */
function rowsOf(text: string): { who?: string; line: string }[] {
  return text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const m = l.match(/^([A-Z][a-z]+):\s*(.*)$/);
      return m ? { who: m[1], line: m[2] } : { line: l };
    });
}

function fillLine(line: string, word: string | null) {
  return line.replace("___", word ?? "______");
}

/* ── the activity ───────────────────────────────────────────────────── */

export function LabActivity({ spec, question, value, activityState, onChange, readOnly }: ActivityComponentProps & { spec: LabSpec }) {
  const options: Opt[] = question?.multipleChoiceConfig?.options ?? [];
  const byId = (id?: string) => options.find((o) => o.id === id);
  const m = spec.mech;
  const passage = (question?.customConfig?.passage as string | undefined) ?? "";

  const gateLeft = (w: LabState) => (spec.gate ? spec.gate.steps.filter((s) => !w.extra[s.id]) : []);

  const derive = (w: LabState): Derived => {
    const left = gateLeft(w);
    const gateNote = left.length ? `First: ${left[0].label.toLowerCase()}.` : undefined;
    const withGate = (d: Derived): Derived => (left.length && d.value ? { value: d.value, note: gateNote } : d);
    switch (m.kind) {
      case "assemble":
      case "build": {
        const blocks = m.kind === "build" && m.blocks === "keyboard" ? null : (m.blocks as string[]);
        const parts = blocks ? w.seq.map((i) => blocks[Number(i)]).filter((b) => b !== undefined) : w.seq;
        if (!parts.length) return { note: gateNote ?? (m.kind === "build" ? "Spell the word on the machine." : "Build the missing words from the blocks.") };
        let text = m.kind === "build" ? parts.map((p) => p.replace(/^\+/, "")).join("") : joinBlocks(parts);
        if (m.kind === "build") text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        const hit = options.find((o) => normText(o.text) === normText(text));
        if (!hit) return { value: text, note: m.kind === "build" ? "The stamping machine only stamps a spelling printed on its label list." : "The machine only prints a phrase from the paper's list — keep building or take a block back." };
        return withGate({ value: text, optionId: hit.id });
      }
      case "punctuate": {
        if (!w.seq.length) return { note: "Key the punctuation into the sentence." };
        const text = w.seq.join("");
        const hit = options.find((o) => normText(o.text) === normText(text));
        if (!hit) return { value: text, note: "That set of marks is not one the paper prints." };
        return { value: text, optionId: hit.id };
      }
      case "repair": {
        const o = byId(w.flag);
        if (!o) return { note: "Inspect the sentence and flag the part with the mistake." };
        const fix = (w.fix ?? "").trim();
        return { value: fix ? `“${o.text}” → “${fix}”` : `“${o.text}”`, optionId: o.id, note: fix ? undefined : "You can also type how the flagged part should read." };
      }
      case "evidence": {
        if (!w.marks.length) return { note: "Collect at least one line of the passage as evidence." };
        const o = byId(w.pick);
        if (!o) return { note: `Now set your conclusion on the ${m.pedestal ?? "pedestal"}.` };
        return { value: o.text, optionId: o.id };
      }
      default: {
        const o = byId(w.pick);
        if (!o) {
          const n =
            m.kind === "drum" ? "Spin the drum to a word." : m.kind === "scale" ? "Slide the marker to a point on the scale." : m.kind === "badge" ? `Pin a plaque on the ${m.target}.` : "Thread a connector between the two ideas.";
          return { note: gateNote ?? n };
        }
        return withGate({ value: o.text, optionId: o.id });
      }
    }
  };

  const play = usePlay<LabState>({ question, initial: { seq: [], marks: [], extra: {} }, activityState, value, onChange, readOnly, derive });
  const w = play.world;
  const extra = w.extra ?? {};
  const d = play.derived;

  // What the student's build currently says, for the sentence and the world.
  const word = (() => {
    if (m.kind === "assemble" || m.kind === "build" || m.kind === "punctuate") return d.value ?? null;
    if (m.kind === "repair") return byId(w.flag)?.text ?? null;
    return byId(w.pick)?.text ?? null;
  })();
  const filled = !!word;

  const sentence = sentenceOf(spec, question?.questionText);
  const gapLine = rowsOf(sentence).find((r) => r.line.includes("___"));
  const bubbleText = gapLine && m.kind !== "punctuate" ? fillLine(gapLine.line, word) : null;

  const bubbleRef = useRef<HTMLDivElement>(null);
  const poke = (key: string, v: unknown) => !play.locked && play.set((p) => ({ ...p, extra: { ...(p.extra ?? {}), [key]: v } }));
  const left = gateLeft({ ...w, extra });
  const blocked = d.value && !d.optionId && (m.kind === "assemble" || m.kind === "build" || m.kind === "punctuate") ? "Only a phrase the paper prints can be recorded." : left.length && d.value ? `Finish the task first: ${left[0].label.toLowerCase()}.` : undefined;

  return (
    <Shell dim="3D" play={play} question={question} title={spec.title} subtitle={spec.mission} icon={spec.icon} hints={spec.hints} submitBlocked={blocked}>
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl border-2 border-violet-100">
          <World3D cue={word ?? null} camera={spec.camera ?? { position: [0, 2.1, 4.8], fov: 45 }} target={spec.camera?.target ?? [0, 0.95, 0]} height="320px" sky={spec.sky} ground={spec.ground}>
            <spec.World word={word} filled={filled} locked={play.locked} extra={extra} poke={poke} />
            {bubbleText && spec.bubbleAt && <Anchor at={spec.bubbleAt} target={bubbleRef} />}
          </World3D>
          {bubbleText && spec.bubbleAt && <Bubble innerRef={bubbleRef} text={bubbleText} />}
          <div className="pointer-events-none absolute left-2 top-2 rounded-lg bg-white/85 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-violet-600 shadow-sm">{spec.engine}</div>
        </div>

        {spec.gate && <GatePanel gate={spec.gate} extra={extra} locked={play.locked} onDo={(id) => poke(id, true)} />}

        {m.kind !== "evidence" && m.kind !== "repair" && <SentenceStrip question={question} sentence={sentence} word={word} kind={m.kind} />}

        {m.kind === "assemble" && <AssemblePanel blocks={m.blocks} seq={w.seq} locked={play.locked} tray={m.tray} onSeq={(seq) => play.set((p) => ({ ...p, seq }))} />}
        {m.kind === "drum" && <DrumPanel machine={m.machine} options={options} pick={w.pick} locked={play.locked} onPick={(pick) => play.set((p) => ({ ...p, pick }))} />}
        {m.kind === "punctuate" && <PunctuatePanel m={m} seq={w.seq} locked={play.locked} onSeq={(seq) => play.set((p) => ({ ...p, seq }))} />}
        {m.kind === "repair" && <RepairPanel options={options} flag={w.flag} fix={w.fix ?? ""} locked={play.locked} hint={m.inspectHint} onFlag={(flag) => play.set((p) => ({ ...p, flag }))} onFix={(fix) => play.set((p) => ({ ...p, fix }))} />}
        {m.kind === "build" && <BuildPanel m={m} options={options} seq={w.seq} locked={play.locked} onSeq={(seq) => play.set((p) => ({ ...p, seq }))} />}
        {m.kind === "scale" && <ScalePanel m={m} options={options} pick={w.pick} locked={play.locked} onPick={(pick) => play.set((p) => ({ ...p, pick }))} />}
        {m.kind === "badge" && <BadgePanel target={m.target} verb={m.verb} options={options} pick={w.pick} locked={play.locked} onPick={(pick) => play.set((p) => ({ ...p, pick }))} />}
        {m.kind === "link" && <LinkPanel left={m.left} right={m.right} options={options} pick={w.pick} locked={play.locked} onPick={(pick) => play.set((p) => ({ ...p, pick }))} />}
        {m.kind === "evidence" && (
          <EvidencePanel
            passage={passage}
            ask={m.ask}
            question={question?.questionText ?? ""}
            pedestal={m.pedestal}
            chain={m.chain}
            options={options}
            marks={w.marks}
            pick={w.pick}
            locked={play.locked}
            onMark={(i) => play.set((p) => ({ ...p, marks: p.marks.includes(i) ? p.marks.filter((x) => x !== i) : [...p.marks, i] }))}
            onPick={(pick) => play.set((p) => ({ ...p, pick }))}
          />
        )}
      </div>
    </Shell>
  );
}

/* ── shared pieces ──────────────────────────────────────────────────── */

function SentenceStrip({ question, sentence, word, kind }: { question?: ActivityComponentProps["question"]; sentence: string; word: string | null; kind: Mech["kind"] }) {
  const given = question?.customConfig?.givenWord as string | undefined;
  const relation = question?.customConfig?.relation as string | undefined;
  const instruction = question?.customConfig?.instruction as string | undefined;
  if (given) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border-2 border-violet-100 bg-gradient-to-br from-violet-50 to-sky-50 p-4">
        <div className="text-center">
          <div className="text-[10px] font-black uppercase tracking-wider text-violet-500">Given word</div>
          <div className="font-serif text-3xl font-black text-slate-900">{given}</div>
        </div>
        <div className="text-2xl font-black text-violet-300">{relation === "antonym" ? "⇄" : "≈"}</div>
        <div className="text-center">
          <div className="text-[10px] font-black uppercase tracking-wider text-violet-500">{relation === "antonym" ? "Opposite meaning" : "Same meaning"}</div>
          <div className={`min-w-[150px] rounded-xl border-2 px-3 py-1.5 font-serif text-2xl font-black ${word ? "border-violet-400 bg-white text-violet-900" : "border-dashed border-slate-300 bg-white/70 text-slate-300"}`}>{word ?? "?"}</div>
        </div>
      </div>
    );
  }
  const rows = rowsOf(sentence);
  const hasBlank = sentence.includes("___");
  return (
    <div className="rounded-2xl border-2 border-violet-100 bg-gradient-to-br from-violet-50 to-sky-50 p-4">
      {instruction && <div className="mb-1.5 text-center text-[10px] font-black uppercase tracking-wider text-violet-500">{instruction}</div>}
      <div className="space-y-1.5">
        {rows.map((r, i) => {
          const [a, b] = r.line.includes("___") ? r.line.split("___") : [r.line, null];
          return (
            <p key={i} className={`text-center text-base font-bold leading-relaxed sm:text-lg ${r.line.includes("___") || !hasBlank ? "text-slate-800" : "text-slate-500"}`}>
              {r.who && <span className="mr-1.5 rounded-md bg-violet-100 px-1.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-violet-700">{r.who}</span>}
              {a}
              {b !== null && (
                <span
                  className={`mx-1 inline-flex min-w-[96px] items-center justify-center rounded-lg border-2 px-2.5 py-0.5 align-middle font-black transition-all ${
                    word ? "border-violet-400 bg-white text-violet-900 shadow-[0_2px_0_#c4b5fd]" : "border-dashed border-slate-300 bg-white/70 text-slate-300"
                  }`}
                  aria-label="sentence gap"
                >
                  {kind === "punctuate" ? word ?? "  " : word ?? "______"}
                </span>
              )}
              {b}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function Label({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
      <Icon className="h-3.5 w-3.5" /> {children}
    </div>
  );
}

const chip = "inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 px-3 text-sm font-black transition-all select-none disabled:opacity-50";

/* ── WordAssemblyEngine / SentenceBuilderEngine ─────────────────────── */

function AssemblePanel({ blocks, seq, onSeq, locked, tray }: { blocks: string[]; seq: string[]; onSeq: (s: string[]) => void; locked: boolean; tray?: string }) {
  const used = new Set(seq);
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr]">
      <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 p-3">
        <Label icon={Hammer}>Your build — tap a block to take it back</Label>
        <div className="flex min-h-[52px] flex-wrap items-center gap-1.5 rounded-xl border-2 border-dashed border-indigo-200 bg-white p-2">
          {seq.length === 0 && <span className="text-xs font-semibold text-slate-400">Tap blocks in the order you want them.</span>}
          {seq.map((i, k) => (
            <button key={`${i}-${k}`} type="button" disabled={locked} aria-label={`take back ${blocks[Number(i)]}`} onClick={() => onSeq(seq.filter((_, j) => j !== k))} className={`${chip} border-indigo-400 bg-indigo-600 text-white shadow-[0_3px_0_#3730a3]`}>
              {showBlock(blocks[Number(i)])}
            </button>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <button type="button" disabled={locked || !seq.length} onClick={() => onSeq(seq.slice(0, -1))} className={`${chip} border-slate-200 bg-white text-slate-600`}>
            <Undo2 className="mr-1 h-4 w-4" /> Undo
          </button>
          <button type="button" disabled={locked || !seq.length} onClick={() => onSeq([])} className={`${chip} border-slate-200 bg-white text-slate-600`}>
            Clear
          </button>
        </div>
      </div>
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/70 p-3">
        <Label icon={MousePointerClick}>{tray ?? "Word blocks"}</Label>
        <div className="flex flex-wrap justify-center gap-2">
          {blocks.map((b, i) => {
            const id = String(i);
            return (
              <button key={id} type="button" disabled={locked || used.has(id)} aria-label={`block ${b}`} onClick={() => onSeq([...seq, id])} className={`${chip} border-violet-300 bg-white text-violet-900 shadow-[0_3px_0_#c4b5fd] hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-none`}>
                {showBlock(b)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── GrammarSimulationEngine: the word drum ─────────────────────────── */

function DrumPanel({ machine, options, pick, onPick, locked }: { machine: string; options: Opt[]; pick?: string; onPick: (id: string) => void; locked: boolean }) {
  const idx = options.findIndex((o) => o.id === pick);
  const drag = useRef<{ y: number; moved: number } | null>(null);
  const spin = (dir: 1 | -1) => {
    if (locked || !options.length) return;
    const next = idx < 0 ? (dir === 1 ? 0 : options.length - 1) : (idx + dir + options.length) % options.length;
    onPick(options[next].id);
  };
  const at = (k: number) => options[((idx < 0 ? 0 : idx) + k + options.length * 4) % options.length];
  return (
    <div className="mx-auto flex max-w-[560px] items-stretch gap-3 rounded-2xl border-2 border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3 shadow-inner">
      <div className="flex flex-col justify-center gap-2">
        <button type="button" aria-label="spin drum up" disabled={locked} onClick={() => spin(-1)} className={`${chip} border-slate-300 bg-white text-slate-700`}>
          <ArrowUp className="h-5 w-5" />
        </button>
        <button type="button" aria-label="spin drum down" disabled={locked} onClick={() => spin(1)} className={`${chip} border-slate-300 bg-white text-slate-700`}>
          <ArrowDown className="h-5 w-5" />
        </button>
      </div>
      <div
        role="spinbutton"
        tabIndex={locked ? -1 : 0}
        aria-label={`${machine} drum`}
        aria-valuetext={idx < 0 ? "not set" : options[idx].text}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") (e.preventDefault(), spin(1));
          if (e.key === "ArrowUp") (e.preventDefault(), spin(-1));
        }}
        onWheel={(e) => spin(e.deltaY > 0 ? 1 : -1)}
        onPointerDown={(e) => {
          drag.current = { y: e.clientY, moved: 0 };
          (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const dy = e.clientY - drag.current.y;
          if (Math.abs(dy) > 34) {
            spin(dy > 0 ? -1 : 1);
            drag.current.y = e.clientY;
          }
        }}
        onPointerUp={() => (drag.current = null)}
        className="relative flex-1 cursor-ns-resize touch-none overflow-hidden rounded-xl border-4 border-slate-700 bg-slate-800 outline-none focus-visible:ring-4 focus-visible:ring-violet-300"
        style={{ perspective: 500 }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-slate-800 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-slate-800 to-transparent" />
        <div className="flex flex-col items-center py-2">
          {[-1, 0, 1].map((k) => {
            const o = at(k);
            const centre = k === 0;
            return (
              <div
                key={`${o?.id}-${k}`}
                className={`w-[92%] rounded-lg text-center font-mono font-black transition-all ${centre ? "my-1 bg-amber-50 py-2 text-xl text-slate-900 shadow-lg" : "py-1 text-sm text-slate-400"}`}
                style={{ transform: `rotateX(${k * -38}deg)` }}
              >
                {centre && idx < 0 ? <span className="text-slate-300">— spin —</span> : o?.text}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex w-[92px] flex-col items-center justify-center gap-1 text-center">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">{machine}</div>
        <div className={`h-3 w-3 rounded-full ${idx < 0 ? "bg-slate-300" : "bg-emerald-400 shadow-[0_0_10px_#34d399]"}`} />
        <div className="text-[10px] font-semibold text-slate-400">drag, scroll or use the arrows</div>
      </div>
    </div>
  );
}

/* ── PunctuationEngine ──────────────────────────────────────────────── */

function PunctuatePanel({ m, seq, onSeq, locked }: { m: Extract<Mech, { kind: "punctuate" }>; seq: string[]; onSeq: (s: string[]) => void; locked: boolean }) {
  const slots = m.slots ?? 2;
  return (
    <div className="space-y-3 rounded-2xl border-2 border-amber-100 bg-amber-50/50 p-4">
      <Label icon={Hammer}>Punctuation press — key the marks, in order, into the gap</Label>
      <p className="text-center font-serif text-lg font-bold text-slate-800 sm:text-xl">
        {m.before}
        <span className="mx-1 inline-flex gap-1 align-middle">
          {Array.from({ length: slots }, (_, i) => (
            <span key={i} className={`inline-flex h-11 w-9 items-center justify-center rounded-lg border-2 font-mono text-2xl font-black ${seq[i] ? "border-amber-500 bg-white text-slate-900" : "border-dashed border-amber-300 bg-white/60 text-transparent"}`} aria-label={`mark slot ${i + 1}`}>
              {seq[i] ?? "·"}
            </span>
          ))}
        </span>
        {m.after}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {m.marks.map((k) => (
          <button key={k} type="button" aria-label={`mark ${k}`} disabled={locked || seq.length >= slots} onClick={() => onSeq([...seq, k])} className={`${chip} w-12 border-amber-300 bg-white font-mono text-2xl text-slate-900 shadow-[0_3px_0_#fcd34d]`}>
            {k}
          </button>
        ))}
        <button type="button" aria-label="remove last mark" disabled={locked || !seq.length} onClick={() => onSeq(seq.slice(0, -1))} className={`${chip} border-slate-200 bg-white text-slate-600`}>
          <Delete className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/* ── ErrorRepairEngine ──────────────────────────────────────────────── */

function RepairPanel({ options, flag, fix, onFlag, onFix, locked, hint }: { options: Opt[]; flag?: string; fix: string; onFlag: (id: string) => void; onFix: (t: string) => void; locked: boolean; hint?: string }) {
  const [lens, setLens] = useState<string | undefined>(flag);
  const inspected = options.find((o) => o.id === lens);
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border-2 border-rose-100 bg-rose-50/50 p-4">
        <Label icon={Search}>Sentence under inspection — tap a part to put it under the lens</Label>
        <p className="flex flex-wrap items-center justify-center gap-y-2 text-base font-bold text-slate-800 sm:text-lg">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              aria-label={`inspect ${o.text}`}
              disabled={locked}
              onClick={() => setLens(o.id)}
              className={`mx-0.5 rounded-lg border-2 px-2 py-1 transition-all ${flag === o.id ? "border-rose-500 bg-rose-100 text-rose-900" : lens === o.id ? "border-amber-400 bg-amber-50" : "border-transparent hover:border-slate-200 hover:bg-white"}`}
            >
              {flag === o.id && <Flag className="mr-1 inline h-4 w-4 text-rose-600" />}
              {o.text}
            </button>
          ))}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-4">
          <Label icon={Search}>The lens</Label>
          {inspected ? (
            <>
              <div className="flex flex-wrap justify-center gap-1.5">
                {inspected.text.split(/\s+/).map((wd, i) => (
                  <span key={i} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 font-serif text-2xl font-black text-slate-800">
                    {wd}
                  </span>
                ))}
              </div>
              <button type="button" disabled={locked} onClick={() => onFlag(inspected.id)} className={`${chip} mt-3 w-full border-rose-400 ${flag === inspected.id ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-800"}`}>
                <Flag className="mr-1.5 h-4 w-4" /> {flag === inspected.id ? "Flagged as faulty" : "Flag this part as faulty"}
              </button>
            </>
          ) : (
            <p className="text-center text-xs font-semibold text-slate-400">{hint ?? "Read each part closely: word forms, plurals, possessives."}</p>
          )}
        </div>
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-4">
          <Label icon={Hammer}>Repair bench</Label>
          {flag ? (
            <>
              <p className="mb-2 text-xs font-semibold text-slate-500">Rewrite the flagged part so the sentence is correct:</p>
              <input
                type="text"
                aria-label="corrected part"
                value={fix}
                disabled={locked}
                onChange={(e) => onFix(e.target.value.slice(0, 60))}
                placeholder={options.find((o) => o.id === flag)?.text}
                className="w-full rounded-xl border-2 border-slate-300 px-3 py-2 font-serif text-lg font-bold text-slate-800 outline-none focus:border-violet-400"
              />
            </>
          ) : (
            <p className="text-center text-xs font-semibold text-slate-400">Flag a part first, then rewrite it here.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── SpellingEngine ─────────────────────────────────────────────────── */

const KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function BuildPanel({ m, options, seq, onSeq, locked }: { m: Extract<Mech, { kind: "build" }>; options: Opt[]; seq: string[]; onSeq: (s: string[]) => void; locked: boolean }) {
  const keyboard = m.blocks === "keyboard";
  const blocks = keyboard ? [] : (m.blocks as string[]);
  const used = new Set(seq);
  const shown = keyboard ? seq.join("") : seq.map((i) => blocks[Number(i)]).join("");
  return (
    <div className="space-y-3 rounded-2xl border-2 border-sky-100 bg-sky-50/60 p-4">
      <p className="text-center text-sm font-semibold text-sky-900">
        The word that means <span className="font-black">‘{m.meaning}’</span>
      </p>
      <div className="flex min-h-[54px] flex-wrap items-center justify-center gap-1 rounded-xl border-2 border-sky-300 bg-white px-3 py-2 font-mono text-2xl font-black tracking-wider text-slate-800" aria-label="machine display">
        {!keyboard &&
          seq.map((i, k) => (
            <button key={`${i}-${k}`} type="button" disabled={locked} aria-label={`take back ${blocks[Number(i)]}`} onClick={() => onSeq(seq.filter((_, j) => j !== k))} className="rounded-lg border-2 border-sky-400 bg-sky-100 px-2 py-0.5 text-sky-900">
              {blocks[Number(i)].toUpperCase()}
            </button>
          ))}
        {keyboard && (shown ? shown.toUpperCase() : null)}
        {!shown && <span className="text-sm font-bold text-slate-300">{keyboard ? "type the spelling" : "tap the syllable blocks in order"}</span>}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {options.map((o) => (
          <span key={o.id} className="rounded-lg border border-sky-200 bg-white px-2 py-0.5 font-mono text-xs text-sky-800">
            {o.text}
          </span>
        ))}
      </div>
      <p className="text-center text-[10px] font-semibold text-sky-600">The machine can stamp one of the spellings on its label list — build the right one.</p>
      {keyboard ? (
        <div className="mx-auto grid max-w-[520px] grid-cols-9 gap-1">
          {KEYS.map((k) => (
            <button key={k} type="button" aria-label={`key ${k}`} disabled={locked || seq.length >= 16} onClick={() => onSeq([...seq, k.toLowerCase()])} className="h-10 rounded-lg border-2 border-slate-200 bg-white font-mono text-sm font-black text-slate-700 shadow-[0_2px_0_#e2e8f0] active:translate-y-0.5">
              {k}
            </button>
          ))}
          <button type="button" aria-label="key backspace" disabled={locked || !seq.length} onClick={() => onSeq(seq.slice(0, -1))} className="flex h-10 items-center justify-center rounded-lg border-2 border-slate-200 bg-slate-50 text-slate-600">
            <Delete className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-2">
          {blocks.map((b, i) => (
            <button key={i} type="button" aria-label={`syllable ${b}`} disabled={locked || used.has(String(i))} onClick={() => onSeq([...seq, String(i)])} className={`${chip} border-sky-300 bg-white font-mono uppercase text-sky-900 shadow-[0_3px_0_#7dd3fc]`}>
              {b}
            </button>
          ))}
          <button type="button" aria-label="remove last block" disabled={locked || !seq.length} onClick={() => onSeq(seq.slice(0, -1))} className={`${chip} border-slate-200 bg-white text-slate-600`}>
            <Delete className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── TimelineEngine: slide a marker along a scale ───────────────────── */

function ScalePanel({ m, options, pick, onPick, locked }: { m: Extract<Mech, { kind: "scale" }>; options: Opt[]; pick?: string; onPick: (id: string) => void; locked: boolean }) {
  const stops = m.stops.map((s) => ({ ...s, text: options.find((o) => o.id === s.option)?.text ?? s.option })).sort((a, b) => a.at - b.at);
  const cur = stops.findIndex((s) => s.option === pick);
  const [drag, setDrag] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const shape = m.shape ?? "line";
  const W = 600;
  const H = shape === "ring" ? 300 : 150;

  const nearest = (t: number) => stops.reduce((best, s) => (Math.abs(s.at - t) < Math.abs(best.at - t) ? s : best), stops[0]);
  const tFromEvent = (e: React.PointerEvent) => {
    const r = svg.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const y = ((e.clientY - r.top) / r.height) * H;
    if (shape === "ring") {
      const a = Math.atan2(x - W / 2, -(y - H / 2));
      return ((a / (Math.PI * 2)) + 1) % 1;
    }
    return Math.min(1, Math.max(0, (x - 40) / (W - 80)));
  };
  const onMove = (e: React.PointerEvent) => {
    if (drag === null) return;
    setDrag(tFromEvent(e));
  };
  const release = (e: React.PointerEvent) => {
    if (drag === null) return;
    const s = nearest(tFromEvent(e));
    setDrag(null);
    onPick(s.option);
  };
  const t = drag ?? (cur >= 0 ? stops[cur].at : null);
  const step = (dir: 1 | -1) => {
    if (locked) return;
    const next = cur < 0 ? (dir === 1 ? 0 : stops.length - 1) : Math.min(stops.length - 1, Math.max(0, cur + dir));
    onPick(stops[next].option);
  };

  const ringXY = (tt: number, r: number) => [W / 2 + Math.sin(tt * Math.PI * 2) * r, H / 2 - Math.cos(tt * Math.PI * 2) * r];
  const lineX = (tt: number) => 40 + tt * (W - 80);

  return (
    <div className="rounded-2xl border-2 border-emerald-100 bg-emerald-50/40 p-3">
      <Label icon={MousePointerClick}>{shape === "ring" ? "Drag the hand round the dial" : "Drag the marker along the scale"} — or use the arrow keys</Label>
      <svg
        ref={svg}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none select-none outline-none focus-visible:ring-4 focus-visible:ring-violet-300 rounded-xl"
        role="slider"
        tabIndex={locked ? -1 : 0}
        aria-label="scale marker"
        aria-valuetext={cur >= 0 ? stops[cur].label ?? stops[cur].text : "not set"}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") (e.preventDefault(), step(1));
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") (e.preventDefault(), step(-1));
        }}
        onPointerDown={(e) => {
          if (locked) return;
          (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
          setDrag(tFromEvent(e));
        }}
        onPointerMove={onMove}
        onPointerUp={release}
      >
        {shape === "ring" ? (
          <>
            <circle cx={W / 2} cy={H / 2} r={118} fill="#FFFFFF" stroke="#A7F3D0" strokeWidth={10} />
            {Array.from({ length: 24 }, (_, i) => {
              const [x1, y1] = ringXY(i / 24, 104);
              const [x2, y2] = ringXY(i / 24, i % 6 === 0 ? 90 : 97);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94A3B8" strokeWidth={i % 6 === 0 ? 3 : 1.5} />;
            })}
            {(m.ticks ?? []).map((k) => {
              const [x, y] = ringXY(k.at, 76);
              return <text key={k.label} x={x} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748B">{k.label}</text>;
            })}
            {stops.map((s) => {
              const [x, y] = ringXY(s.at, 140);
              const on = s.option === pick;
              return (
                <g key={s.option}>
                  <rect x={x - 48} y={y - 13} width={96} height={26} rx={8} fill={on ? "#059669" : "#FFFFFF"} stroke={on ? "#047857" : "#6EE7B7"} strokeWidth={2} />
                  <text x={x} y={y + 5} textAnchor="middle" fontSize={14} fontWeight={800} fill={on ? "#FFFFFF" : "#065F46"}>{s.label ?? s.text}</text>
                </g>
              );
            })}
            {t !== null && (() => {
              const [x, y] = ringXY(t, 96);
              return <line x1={W / 2} y1={H / 2} x2={x} y2={y} stroke="#0F172A" strokeWidth={7} strokeLinecap="round" />;
            })()}
            <circle cx={W / 2} cy={H / 2} r={10} fill="#0F172A" />
          </>
        ) : (
          <>
            <rect x={40} y={62} width={W - 80} height={14} rx={7} fill="#D1FAE5" stroke="#6EE7B7" />
            {(m.ticks ?? []).map((k) => (
              <g key={k.label}>
                <line x1={lineX(k.at)} y1={56} x2={lineX(k.at)} y2={82} stroke="#94A3B8" strokeWidth={1.5} />
                <text x={lineX(k.at)} y={100} textAnchor="middle" fontSize={11} fontWeight={700} fill="#94A3B8">{k.label}</text>
              </g>
            ))}
            {m.from && <text x={40} y={40} fontSize={12} fontWeight={800} fill="#64748B">{m.from}</text>}
            {m.to && <text x={W - 40} y={40} textAnchor="end" fontSize={12} fontWeight={800} fill="#64748B">{m.to}</text>}
            {stops.map((s) => {
              const on = s.option === pick;
              return (
                <g key={s.option}>
                  <circle cx={lineX(s.at)} cy={69} r={8} fill={on ? "#059669" : "#FFFFFF"} stroke="#059669" strokeWidth={3} />
                  <rect x={lineX(s.at) - 54} y={112} width={108} height={28} rx={8} fill={on ? "#059669" : "#FFFFFF"} stroke={on ? "#047857" : "#6EE7B7"} strokeWidth={2} />
                  <text x={lineX(s.at)} y={131} textAnchor="middle" fontSize={13} fontWeight={800} fill={on ? "#FFFFFF" : "#065F46"}>{s.label ?? s.text}</text>
                </g>
              );
            })}
            {t !== null && (
              <g transform={`translate(${lineX(t)},0)`}>
                <line x1={0} y1={44} x2={0} y2={92} stroke="#0F172A" strokeWidth={3} />
                <path d="M -11 30 L 11 30 L 0 46 Z" fill="#0F172A" />
              </g>
            )}
          </>
        )}
      </svg>
    </div>
  );
}

/* ── VocabularyEngine: pin a plaque onto the scene ──────────────────── */

function BadgePanel({ target, verb, options, pick, onPick, locked }: { target: string; verb?: string; options: Opt[]; pick?: string; onPick: (id: string) => void; locked: boolean }) {
  const [held, setHeld] = useState<string | null>(null);
  const pinned = options.find((o) => o.id === pick);
  return (
    <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr]">
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/70 p-3">
        <Label icon={Pin}>Word plaques — pick one up, then pin it</Label>
        <div className="grid grid-cols-2 gap-2">
          {options.map((o) => (
            <button key={o.id} type="button" disabled={locked} aria-pressed={held === o.id} aria-label={`plaque ${o.text}`} onClick={() => setHeld((h) => (h === o.id ? null : o.id))} className={`${chip} border-amber-300 bg-gradient-to-b from-amber-50 to-white font-serif text-base text-amber-950 shadow-[0_3px_0_#fcd34d] ${held === o.id ? "-translate-y-1 ring-4 ring-amber-300" : ""}`}>
              {o.text}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        disabled={locked || !held}
        onClick={() => {
          if (held) onPick(held);
          setHeld(null);
        }}
        aria-label={`pin the plaque on the ${target}`}
        className={`flex min-h-[120px] flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition-all ${held ? "animate-pulse border-amber-400 bg-amber-50" : "border-violet-200 bg-violet-50/60"}`}
      >
        <div className="text-[10px] font-black uppercase tracking-wider text-violet-500">{verb ?? "Pin it on"} the {target}</div>
        <div className={`mt-2 rounded-xl border-2 px-4 py-2 font-serif text-2xl font-black ${pinned ? "border-amber-500 bg-white text-amber-950 shadow-md" : "border-dashed border-slate-300 text-slate-300"}`}>{pinned?.text ?? "empty"}</div>
        <div className="mt-1 text-[10px] font-semibold text-slate-400">{held ? "tap here to pin it" : "pick up a plaque first"}</div>
      </button>
    </div>
  );
}

/* ── ConnectorEngine: thread the link between two ideas ─────────────── */

function LinkPanel({ left, right, options, pick, onPick, locked }: { left: string; right: string; options: Opt[]; pick?: string; onPick: (id: string) => void; locked: boolean }) {
  const svg = useRef<SVGSVGElement>(null);
  const [pull, setPull] = useState<{ x: number; y: number } | null>(null);
  const W = 640;
  const H = 60 + options.length * 58;
  const knotY = (i: number) => 50 + i * 58;
  const at = options.findIndex((o) => o.id === pick);
  const L = { x: 110, y: H / 2 };
  const R = { x: W - 110, y: H / 2 };
  const K = (i: number) => ({ x: W / 2, y: knotY(i) });
  const toSvg = (e: React.PointerEvent) => {
    const r = svg.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };
  const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => `M ${a.x} ${a.y} C ${(a.x + b.x) / 2} ${a.y}, ${(a.x + b.x) / 2} ${b.y}, ${b.x} ${b.y}`;
  return (
    <div className="rounded-2xl border-2 border-sky-100 bg-sky-50/40 p-3">
      <Label icon={Link2}>Pull the thread from the left idea onto a connector knot — or tap a knot</Label>
      <svg
        ref={svg}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none select-none"
        onPointerMove={(e) => pull && setPull(toSvg(e))}
        onPointerUp={(e) => {
          if (!pull) return;
          const p = toSvg(e);
          const i = options.findIndex((_, k) => Math.hypot(p.x - K(k).x, p.y - K(k).y) < 50);
          setPull(null);
          if (i >= 0) onPick(options[i].id);
        }}
      >
        {at >= 0 && (
          <>
            <path d={curve(L, K(at))} stroke="#0EA5E9" strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d={curve(K(at), R)} stroke="#0EA5E9" strokeWidth={5} fill="none" strokeLinecap="round" />
          </>
        )}
        {pull && <path d={curve(L, pull)} stroke="#F59E0B" strokeWidth={4} strokeDasharray="8 6" fill="none" />}
        <g
          onPointerDown={(e) => {
            if (locked) return;
            (e.currentTarget.ownerSVGElement as Element | null)?.setPointerCapture?.(e.pointerId);
            setPull(toSvg(e));
          }}
          style={{ cursor: locked ? "default" : "grab" }}
        >
          <rect x={10} y={L.y - 44} width={180} height={88} rx={14} fill="#FFFFFF" stroke="#7DD3FC" strokeWidth={3} />
          <foreignObject x={16} y={L.y - 40} width={168} height={80}>
            <div className="flex h-full items-center justify-center text-center text-[13px] font-bold leading-tight text-slate-800">{left}</div>
          </foreignObject>
          <circle cx={L.x + 80} cy={L.y} r={10} fill="#0EA5E9" />
        </g>
        <rect x={W - 190} y={R.y - 44} width={180} height={88} rx={14} fill="#FFFFFF" stroke="#7DD3FC" strokeWidth={3} />
        <foreignObject x={W - 184} y={R.y - 40} width={168} height={80}>
          <div className="flex h-full items-center justify-center text-center text-[13px] font-bold leading-tight text-slate-800">{right}</div>
        </foreignObject>
        <circle cx={R.x - 80} cy={R.y} r={10} fill="#0EA5E9" />
        {options.map((o, i) => {
          const on = i === at;
          return (
            <g key={o.id} role="button" tabIndex={locked ? -1 : 0} aria-label={`connector ${o.text}`} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !locked && onPick(o.id)} onClick={() => !locked && onPick(o.id)} style={{ cursor: locked ? "default" : "pointer" }}>
              <rect x={W / 2 - 70} y={knotY(i) - 20} width={140} height={40} rx={20} fill={on ? "#0EA5E9" : "#FFFFFF"} stroke="#0EA5E9" strokeWidth={2.5} />
              <text x={W / 2} y={knotY(i) + 6} textAnchor="middle" fontSize={17} fontWeight={800} fill={on ? "#FFFFFF" : "#0C4A6E"}>{o.text}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── ReadingInvestigationEngine ─────────────────────────────────────── */

function EvidencePanel({
  passage, ask, question, pedestal, chain, options, marks, pick, onMark, onPick, locked,
}: {
  passage: string; ask: string; question: string; pedestal?: string; chain?: boolean; options: Opt[]; marks: number[]; pick?: string; onMark: (i: number) => void; onPick: (id: string) => void; locked: boolean;
}) {
  const paras = passage.trim().split(/\n\s*\n/);
  const sentences: string[] = [];
  const layout = paras.map((p) =>
    p
      .trim()
      .split(/(?<=[.!?]["”]?)\s+(?=["“A-Z])/)
      .map((s) => {
        sentences.push(s);
        return sentences.length - 1;
      })
  );
  const ordered = [...marks].sort((a, b) => a - b);
  const placed = options.find((o) => o.id === pick);
  return (
    <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
      <div className="max-h-[420px] overflow-auto rounded-2xl border-2 border-amber-100 bg-[#FFFDF7] p-4">
        <Label icon={Highlighter}>The passage — tap a sentence to collect it as evidence</Label>
        {layout.map((ids, pi) => (
          <p key={pi} className="mb-2.5 text-[13.5px] leading-relaxed text-slate-700">
            {ids.map((i) => {
              const on = marks.includes(i);
              return (
                <button key={i} type="button" aria-label={`sentence ${i + 1}`} aria-pressed={on} disabled={locked} onClick={() => onMark(i)} className={`mr-1 inline rounded px-0.5 text-left transition-colors ${on ? "bg-yellow-200 font-semibold text-slate-900" : "hover:bg-amber-100"}`}>
                  {sentences[i]}
                </button>
              );
            })}
          </p>
        ))}
      </div>
      <div className="space-y-3">
        <div className="rounded-2xl border-2 border-violet-100 bg-violet-50/50 p-3">
          <div className="text-[10px] font-black uppercase tracking-wider text-violet-500">Case question</div>
          <p className="text-sm font-bold text-slate-800">{question}</p>
          <p className="mt-1 text-[11px] font-semibold text-slate-500">{ask}</p>
        </div>
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-3">
          <Label icon={Sparkles}>{chain ? "Evidence chain" : "Evidence board"} ({marks.length})</Label>
          {ordered.length === 0 ? (
            <p className="text-center text-xs font-semibold text-slate-400">No evidence collected yet.</p>
          ) : (
            <ol className="space-y-1">
              {ordered.map((i, k) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-white">{k + 1}</span>
                  <span className="text-[11.5px] leading-snug text-slate-700">{sentences[i]}</span>
                  {chain && k < ordered.length - 1 && <span className="sr-only">leads to</span>}
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className={`rounded-2xl border-2 p-3 text-center ${placed ? "border-violet-400 bg-white" : "border-dashed border-violet-200 bg-violet-50/40"}`}>
          <div className="text-[10px] font-black uppercase tracking-wider text-violet-500">{pedestal ?? "Conclusion pedestal"}</div>
          <div className={`mt-1 font-serif text-lg font-black ${placed ? "text-violet-900" : "text-slate-300"}`}>{placed?.text ?? "set a conclusion card here"}</div>
        </div>
        <div className="flex flex-col gap-1.5">
          {options.map((o) => (
            <button key={o.id} type="button" disabled={locked || !marks.length} aria-label={`conclusion card ${o.text}`} onClick={() => onPick(o.id)} className={`flex min-h-[44px] items-center gap-2 rounded-xl border-2 px-3 text-left text-sm font-bold transition-all disabled:opacity-40 ${pick === o.id ? "border-violet-500 bg-violet-600 text-white" : "border-amber-200 bg-white text-slate-800 hover:-translate-y-0.5"}`}>
              <Check className={`h-4 w-4 shrink-0 ${pick === o.id ? "opacity-100" : "opacity-20"}`} />
              {o.text}
            </button>
          ))}
          {!marks.length && <p className="text-center text-[10px] font-semibold text-slate-400">Collect evidence before placing a conclusion.</p>}
        </div>
      </div>
    </div>
  );
}

/* ── AchieverPuzzleEngine: the task before the answer ───────────────── */

function GatePanel({ gate, extra, onDo, locked }: { gate: Gate; extra: Record<string, unknown>; onDo: (id: string) => void; locked: boolean }) {
  const done = gate.steps.filter((s) => extra[s.id]).length;
  return (
    <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[10px] font-black uppercase tracking-wider text-indigo-600">Achiever task · {gate.title}</div>
        <div className="text-[11px] font-black text-indigo-700">
          {done}/{gate.steps.length}
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {gate.steps.map((s, i) => {
          const on = !!extra[s.id];
          const ready = gate.steps.slice(0, i).every((p) => extra[p.id]);
          return (
            <button key={s.id} type="button" disabled={locked || on || !ready} onClick={() => onDo(s.id)} className={`flex min-h-[48px] items-center gap-2 rounded-xl border-2 px-3 text-left text-xs font-bold transition-all ${on ? "border-emerald-400 bg-emerald-50 text-emerald-900" : ready ? "border-indigo-300 bg-white text-indigo-900 hover:-translate-y-0.5" : "border-slate-200 bg-white/60 text-slate-400"}`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${on ? "bg-emerald-500 text-white" : "bg-indigo-100 text-indigo-700"}`}>{on ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
              <span>
                {s.label}
                {!on && ready && <span className="block text-[10px] font-semibold text-indigo-500">{s.action}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Wraps a spec as an activity component. */
export function makeLab(spec: LabSpec, name: string) {
  const C = (props: ActivityComponentProps) => <LabActivity spec={spec} {...props} />;
  C.displayName = name;
  return C;
}

export type { LabState };

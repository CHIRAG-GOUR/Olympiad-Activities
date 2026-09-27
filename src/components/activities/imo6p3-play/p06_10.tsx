"use client";

import React, { useMemo, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { Shuffle, ArrowDownAZ, Boxes, Binary, Waves } from "lucide-react";
import { ActivityComponentProps } from "../kit/types";
import { matchNumber, matchText, matchOptionState } from "../imo6a/shared";
import { usePlay, cfg } from "../imo6a-play/engine";
import { Bay, Gauge, Btn } from "../imo6a-play/PlayShell";
import { Stage3D, Floor } from "../imo6a-play/three";
import { Shell, Board, toggle } from "./kit";

/** Paper 3 (IMO 2019-20 Set A) · Q6–Q10. */

/* ══════════════════════════════════════════════════════════════════════
   Q6 — Symbol Movers
   Figure (1) becomes figure (2) by moving each symbol to a new place. The student builds
   the missing figure (3) by placing the symbols of (4) on an empty frame, then runs the
   movers on it to see what their (3) turns into, and compares that with (4).
   ══════════════════════════════════════════════════════════════════════ */

type Cells = Record<string, string>;
const CELLS = Array.from({ length: 9 }, (_, i) => `${Math.floor(i / 3)},${i % 3}`);
const CELL_NAME = ["top-left", "top-middle", "top-right", "middle-left", "centre", "middle-right", "bottom-left", "bottom-middle", "bottom-right"];

function Frame({ s, onCell, hot, small }: { s: Cells; onCell?: (c: string) => void; hot?: boolean; small?: boolean }) {
  return (
    <div className={`grid grid-cols-3 gap-0.5 rounded-lg border-2 border-slate-400 bg-white p-0.5 ${small ? "w-24" : "w-full max-w-[11rem]"}`}>
      {CELLS.map((c, i) => (
        <button
          key={c}
          type="button"
          disabled={!onCell}
          onClick={() => onCell?.(c)}
          aria-label={onCell ? `cell ${CELL_NAME[i]}` : undefined}
          className={`aspect-square grid place-items-center font-black ${small ? "text-sm" : "text-xl"} rounded ${hot ? "border border-dashed border-violet-300 bg-violet-50/60" : ""}`}
        >
          {s[c] ?? ""}
        </button>
      ))}
    </div>
  );
}

export function Q06SymbolMoversActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const f1 = cfg<Cells>(question, "fig1", {});
  const f2 = cfg<Cells>(question, "fig2", {});
  const f4 = cfg<Cells>(question, "fig4", {});
  const moves = useMemo(() => Object.fromEntries(Object.entries(f1).map(([c, sym]) => [c, Object.keys(f2).find((k) => f2[k] === sym)])), [f1, f2]) as Record<string, string | undefined>;
  const symbols = Object.values(f4);
  const [held, setHeld] = useState<string | null>(null);
  const play = usePlay<{ built: Cells; ran: boolean }>({
    question,
    initial: { built: {}, ran: false },
    derive: (w) => {
      if (Object.keys(w.built).length < symbols.length) return { note: "Place every symbol of (4) on the frame for (3)." };
      return { value: `(3): ${Object.entries(w.built).map(([c, s]) => `${s} ${CELL_NAME[CELLS.indexOf(c)]}`).join(", ")}`, optionId: matchOptionState(question, w.built, (o: Cells, b) => Object.keys(o).length === Object.keys(b).length && Object.keys(o).every((k) => o[k] === b[k])) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const out: Cells = {};
  let stuck = false;
  Object.entries(w.built).forEach(([c, s]) => {
    if (moves[c]) out[moves[c]!] = s;
    else stuck = true;
  });

  return (
    <Shell
      play={play}
      question={question}
      title="Symbol Movers"
      mission="Watch how each symbol of (1) moves to reach (2). Build figure (3): tap a symbol of (4), then tap a cell of the empty frame. Run the movers on your (3) and compare what comes out with (4)."
      icon={Shuffle}
      dim="2D"
      submitLabel="Submit figure (3)"
      hints={["Match symbols by the part they play: the symbol that ends top-left of the pair in (2) started at the bottom of (1).", "Work backwards: find where each symbol of (4) must have started."]}
      live={
        <>
          <Gauge label="Placed" value={`${Object.keys(w.built).length}/${symbols.length}`} tone="violet" />
          <Gauge label="Movers" value={w.ran ? (stuck ? "a symbol had no mover" : "ran") : "not run"} tone={w.ran && !stuck ? "emerald" : "slate"} />
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <Bay label="(1) → (2): the movers">
          <div className="flex items-center gap-2">
            <Frame s={f1} small />
            <span className="text-xl text-violet-600">➜</span>
            <Frame s={f2} small />
          </div>
          <ul className="mt-1 text-[11px] font-semibold text-slate-600">
            {Object.entries(moves).map(([from, to]) => (
              <li key={from}>
                {CELL_NAME[CELLS.indexOf(from)]} → {to ? CELL_NAME[CELLS.indexOf(to)] : "?"}
              </li>
            ))}
          </ul>
        </Bay>
        <Bay label="Build (3), then run → compare with (4)" tone="violet">
          <div className="flex flex-wrap gap-1 mb-2">
            {symbols.map((sym) => (
              <Btn key={sym} className="px-3 text-lg" active={held === sym} tone={held === sym ? "amber" : "slate"} disabled={play.readOnly} onClick={() => setHeld(sym)} ariaLabel={`symbol ${sym}`}>
                {sym}
              </Btn>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Frame
              s={w.built}
              hot
              onCell={(c) => {
                if (play.readOnly || !held) return;
                play.set((p) => {
                  const built = Object.fromEntries(Object.entries(p.built).filter(([k, v]) => v !== held && k !== c));
                  return { built: { ...built, [c]: held }, ran: false };
                });
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Btn tone="emerald" disabled={play.readOnly || !Object.keys(w.built).length} onClick={() => play.patch({ ran: true })}>
              ⚙ Run the movers
            </Btn>
            <Btn tone="slate" disabled={play.readOnly || !Object.keys(w.built).length} onClick={() => play.set({ built: {}, ran: false })}>
              Clear
            </Btn>
          </div>
          {w.ran && (
            <div className="flex items-center gap-2 mt-2">
              <div>
                <div className="text-[10px] font-black text-slate-500">your (3) becomes</div>
                <Frame s={out} small />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-500">figure (4)</div>
                <Frame s={f4} small />
              </div>
            </div>
          )}
        </Bay>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q7 — Alphabet Conveyor
   The student loads the letters onto the conveyor in alphabetical order; the comparison
   then lights every place where the conveyor letter matches the word's letter above it.
   ══════════════════════════════════════════════════════════════════════ */

export function Q07AlphabetConveyorActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const word = cfg<string>(question, "word", "");
  const play = usePlay<{ placed: number[]; compared: boolean }>({
    question,
    initial: { placed: [], compared: false },
    derive: (w) => {
      if (w.placed.length < word.length || !w.compared) return { note: "Load every letter in alphabetical order, then compare." };
      const n = w.placed.filter((idx, i) => word[idx] === word[i]).length;
      const said = n > 2 ? "More than two" : ["None", "One", "Two"][n];
      return { value: `${n} letter${n === 1 ? "" : "s"} unmoved`, optionId: matchText(question, said) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const conveyor = w.placed.map((i) => word[i]);
  const sorted = conveyor.every((c, i) => i === 0 || conveyor[i - 1] <= c);

  return (
    <Shell
      play={play}
      question={question}
      title="Alphabet Conveyor"
      mission="Tap the letters of the word in alphabetical order to load them onto the conveyor, left to right. Then run the comparison: it lights every place where the conveyor letter matches the letter of the word above it."
      icon={ArrowDownAZ}
      dim="2D"
      submitLabel="Submit the count"
      hints={["When a letter appears twice, load both copies one after the other.", "Only letters that land in exactly the same place count."]}
      live={
        <>
          <Gauge label="Loaded" value={`${w.placed.length}/${word.length}`} tone="violet" />
          <Gauge label="In alphabetical order?" value={conveyor.length ? (sorted ? "yes" : "no") : "—"} tone={sorted ? "emerald" : "rose"} />
        </>
      }
    >
      <Board className="space-y-3 p-3">
        <div className="flex gap-1 justify-center">
          {word.split("").map((c, i) => (
            <button key={i} type="button" disabled={play.readOnly || w.placed.includes(i)} onClick={() => play.set((p) => ({ placed: [...p.placed, i], compared: false }))} aria-label={`letter ${c} at ${i + 1}`} className={`w-9 h-11 rounded-lg font-mono font-black text-xl border-2 ${w.placed.includes(i) ? "bg-slate-100 border-slate-200 text-slate-300" : "bg-amber-200 border-amber-400 text-amber-950"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-1 justify-center">
          {word.split("").map((c, i) => {
            const on = w.compared && conveyor[i] === c;
            return (
              <div key={i} className={`w-9 h-11 rounded-lg border-2 border-dashed grid place-items-center font-mono font-black text-xl ${on ? "bg-emerald-300 border-emerald-500" : "border-indigo-300 bg-white text-indigo-900"}`}>
                {conveyor[i] ?? ""}
              </div>
            );
          })}
        </div>
      </Board>
      <div className="flex gap-2">
        <Btn tone="emerald" disabled={play.readOnly || w.placed.length < word.length} onClick={() => play.patch({ compared: true })}>
          Run the comparison
        </Btn>
        <Btn tone="slate" disabled={play.readOnly || !w.placed.length} onClick={() => play.set({ placed: [], compared: false })}>
          Empty the conveyor
        </Btn>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q8 — Cube Wall Lab (3D)
   The wall stands on a turntable. The student orbits it, isolates a layer, and tags each
   cube (on the 3D model or on the layer's floor plan). The tag counter is the answer.
   ══════════════════════════════════════════════════════════════════════ */

export function Q08CubeWallActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const columns = cfg<[number, number, number][]>(question, "columns", []);
  const H = Math.max(1, ...columns.map((c) => c[2]));
  const cubes = useMemo(() => columns.flatMap(([x, z, h]) => Array.from({ length: h }, (_, y) => ({ id: `${x},${y},${z}`, x, y, z }))), [columns]);
  const xs = columns.map((c) => c[0]);
  const zs = columns.map((c) => c[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cz = (Math.min(...zs) + Math.max(...zs)) / 2;
  const play = usePlay<{ tagged: string[]; layer: number | null }>({
    question,
    initial: { tagged: [], layer: null },
    derive: (w) => (!w.tagged.length ? { note: "Tag every cube, including hidden ones." } : { value: `${w.tagged.length} cubes tagged`, optionId: matchNumber(question, w.tagged.length) }),
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const shown = cubes.filter((c) => w.layer === null || c.y === w.layer);
  const tag = (id: string) => !play.readOnly && play.set((p) => ({ ...p, tagged: toggle(p.tagged, id) }));

  return (
    <Shell
      play={play}
      question={question}
      title="Cube Wall Lab"
      mission="Drag round the wall to see it from every side. Isolate a layer to see it on its own, then tap each cube once to tag it (on the model or on the floor plan). Tag every cube in the wall."
      icon={Boxes}
      dim="3D"
      submitLabel="Submit the cube count"
      hints={["Count one layer at a time, then check every layer has the same number.", "The corner where the wall turns is one column, not two."]}
      live={
        <>
          <Gauge label="Cubes tagged" value={w.tagged.length} tone="violet" />
          {Array.from({ length: H }, (_, y) => (
            <Gauge key={y} label={`Layer ${y + 1}`} value={`${cubes.filter((c) => c.y === y && w.tagged.includes(c.id)).length} tagged`} />
          ))}
        </>
      }
    >
      <Stage3D height={300} camera={{ position: [5, 6, 8], fov: 42 }} orbitTarget={[0, 1.2, 0]} readOnly={play.readOnly}>
        <Floor />
        {shown.map((c) => {
          const on = w.tagged.includes(c.id);
          return (
            <mesh
              key={c.id}
              position={[c.x - cx, c.y + 0.5, c.z - cz]}
              castShadow
              onClick={(e: ThreeEvent<MouseEvent>) => {
                if (e.delta > 6) return;
                e.stopPropagation();
                tag(c.id);
              }}
            >
              <boxGeometry args={[0.96, 0.96, 0.96]} />
              <meshStandardMaterial color={on ? "#f59e0b" : ["#a78bfa", "#60a5fa", "#34d399"][c.y % 3]} />
              <Edges color="#1e1b4b" />
            </mesh>
          );
        })}
      </Stage3D>
      <div className="flex flex-wrap gap-1.5">
        <Btn active={w.layer === null} tone={w.layer === null ? "violet" : "slate"} onClick={() => play.patch({ layer: null })}>
          Whole wall
        </Btn>
        {Array.from({ length: H }, (_, y) => (
          <Btn key={y} active={w.layer === y} tone={w.layer === y ? "violet" : "slate"} onClick={() => play.patch({ layer: y })}>
            Layer {y + 1} only
          </Btn>
        ))}
        <Btn tone="slate" disabled={play.readOnly || !w.tagged.length} onClick={() => play.patch({ tagged: [] })}>
          Clear tags
        </Btn>
      </div>
      {w.layer !== null && (
        <Bay label={`Floor plan of layer ${w.layer + 1} (seen from above)`}>
          <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${Math.max(...xs) - Math.min(...xs) + 1}, 2.25rem)` }}>
            {Array.from({ length: (Math.max(...zs) - Math.min(...zs) + 1) * (Math.max(...xs) - Math.min(...xs) + 1) }, (_, k) => {
              const nx = Math.max(...xs) - Math.min(...xs) + 1;
              const x = Math.min(...xs) + (k % nx);
              const z = Math.min(...zs) + Math.floor(k / nx);
              const cube = cubes.find((c) => c.x === x && c.z === z && c.y === w.layer);
              if (!cube) return <span key={k} className="w-9 h-9" />;
              const on = w.tagged.includes(cube.id);
              return (
                <button key={k} type="button" disabled={play.readOnly} onClick={() => tag(cube.id)} aria-label={`cube ${cube.id}`} className={`w-9 h-9 rounded border-2 ${on ? "bg-amber-400 border-amber-600" : "bg-indigo-100 border-indigo-300"}`} />
              );
            })}
          </div>
        </Bay>
      )}
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q9 — Digit Transformation Machine
   The student drops −1 / +1 tokens on each number's tens and units wheels. The machine
   ranks the new numbers; the original of the greatest is the answer.
   ══════════════════════════════════════════════════════════════════════ */

export function Q09DigitMachineActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const nums = cfg<number[]>(question, "numbers", []);
  const [token, setToken] = useState<-1 | 1>(-1);
  const after = (d: Record<number, { t: number; u: number }>, n: number) => n + (d[n]?.t ?? 0) * 10 + (d[n]?.u ?? 0);
  const play = usePlay<{ d: Record<number, { t: number; u: number }>; ranked: boolean }>({
    question,
    initial: { d: {}, ranked: false },
    derive: (w) => {
      const done = nums.filter((n) => w.d[n]?.t && w.d[n]?.u);
      if (done.length < nums.length) return { note: `Change the tens and units wheels of every number (${done.length}/${nums.length}).` };
      if (!w.ranked) return { note: "Rank the new numbers." };
      const best = [...nums].sort((a, b) => after(w.d, b) - after(w.d, a))[0];
      return { value: `${best} → ${after(w.d, best)} is the greatest`, optionId: matchNumber(question, best) };
    },
    activityState,
    value,
    onChange,
    readOnly,
  });
  const w = play.world;
  const drop = (n: number, k: "t" | "u") => play.set((p) => ({ ranked: false, d: { ...p.d, [n]: { ...{ t: 0, u: 0 }, ...p.d[n], [k]: (p.d[n]?.[k] ?? 0) + token } } }));
  const ranked = [...nums].sort((a, b) => after(w.d, b) - after(w.d, a));

  return (
    <Shell
      play={play}
      question={question}
      title="Digit Transformation Machine"
      mission="Pick up the −1 or +1 token, then tap a number's tens wheel or units wheel to drop it there. Do what the question says to every number, then rank the new numbers."
      icon={Binary}
      dim="2D"
      submitLabel="Submit the original of the greatest"
      hints={["Take 1 from the tens digit and add 1 to the units digit of every number.", "Compare the new numbers, but answer with the original number."]}
      live={<Gauge label="Ranking" value={w.ranked ? ranked.map((n) => after(w.d, n)).join(" > ") : "not ranked"} tone="violet" />}
    >
      <div className="flex gap-2">
        {([-1, 1] as const).map((t) => (
          <Btn key={t} active={token === t} tone={token === t ? (t < 0 ? "rose" : "emerald") : "slate"} onClick={() => setToken(t)}>
            Token {t < 0 ? "−1" : "+1"}
          </Btn>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {nums.map((n) => {
          const a = String(after(w.d, n)).padStart(3, "0");
          return (
            <Bay key={n} label={`Number ${n}`}>
              <div className="flex justify-center gap-1 font-mono font-black text-2xl">
                <span className="w-9 h-12 grid place-items-center rounded bg-slate-100">{a[0]}</span>
                {(["t", "u"] as const).map((k, i) => (
                  <button key={k} type="button" disabled={play.readOnly} onClick={() => drop(n, k)} aria-label={`${n} ${k === "t" ? "tens" : "units"}`} className={`w-9 h-12 rounded border-2 ${w.d[n]?.[k] ? "bg-violet-100 border-violet-400" : "bg-white border-slate-300"}`}>
                    {a[i + 1]}
                  </button>
                ))}
              </div>
              <div className="text-[10px] font-bold text-center text-slate-500 mt-1">
                {n} → {after(w.d, n)}
              </div>
            </Bay>
          );
        })}
      </div>
      <Btn tone="amber" disabled={play.readOnly} onClick={() => play.patch({ ranked: true })}>
        📊 Rank the new numbers
      </Btn>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q10 — Reflection Pool
   The student sets the mirror (waterline below or mirror at the right) and then drops each
   character into a slot of the reflection, where it appears reflected. The built
   reflection is compared with the four printed images.
   ══════════════════════════════════════════════════════════════════════ */

function Glyph({ c, flip }: { c: string; flip: "v" | "h" | null }) {
  return (
    <span className="inline-block" style={{ transform: flip === "v" ? "scaleY(-1)" : flip === "h" ? "scaleX(-1)" : undefined }}>
      {c}
    </span>
  );
}

export function Q10ReflectionPoolActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  const text = cfg<string>(question, "text", "");
  const states = cfg<Record<string, { seq: string; flip: "v" | "h" }>>(question, "optionStates", {});
  const [held, setHeld] = useState<number | null>(null);
  const play = usePlay<{ mirror: "v" | "h" | null; slots: (number | null)[] }>({
    question,
    initial: { mirror: null, slots: Array(text.length).fill(null) },
    derive: (w) => {
      if (!w.mirror) return { note: "Set up the mirror." };
      if (w.slots.some((s) => s === null)) return { note: "Drop every character into the reflection." };
      const seq = w.slots.map((i) => text[i!]).join("");
      return { value: `${w.mirror === "v" ? "Water image" : "Mirror image"}: ${seq.split("").join(" ")}`, optionId: matchOptionState(question, { seq, flip: w.mirror }, (o: { seq: string; flip: string }, b) => o.seq === b.seq && o.flip === b.flip) };
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
      title="Reflection Pool"
      mission="Put the mirror where the question needs it. Then tap a character and tap a slot in the pool to drop it there — it appears reflected. Build the whole reflection. The printed images are below for comparison."
      icon={Waves}
      dim="2D"
      submitLabel="Submit the reflection"
      hints={cfg<string[]>(question, "hints", ["A water image is what you see in a pond below the text: top and bottom swap.", "In a water image every character stays in the same position as in the original."])}
      live={<Gauge label="Mirror" value={w.mirror === "v" ? "waterline below" : w.mirror === "h" ? "mirror at the right" : "none"} tone="sky" />}
    >
      <div className="flex flex-wrap gap-1.5">
        <Btn active={w.mirror === "v"} tone={w.mirror === "v" ? "sky" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ mirror: "v" })}>
          🌊 Waterline below the text
        </Btn>
        <Btn active={w.mirror === "h"} tone={w.mirror === "h" ? "sky" : "slate"} disabled={play.readOnly} onClick={() => play.patch({ mirror: "h" })}>
          🪞 Mirror at the right
        </Btn>
      </div>
      <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-sky-200 border-2 border-sky-200 p-3">
        <div className="flex gap-1 justify-center">
          {text.split("").map((c, i) => (
            <button key={i} type="button" disabled={play.readOnly} onClick={() => setHeld(i)} aria-label={`character ${c} at ${i + 1}`} className={`w-9 h-11 rounded-lg font-mono font-black text-2xl border-2 ${held === i ? "bg-amber-300 border-amber-500" : w.slots.includes(i) ? "bg-white/60 border-sky-200 text-slate-400" : "bg-white border-sky-300 text-slate-900"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="h-1 bg-sky-600/50 rounded my-2" />
        <div className="flex gap-1 justify-center">
          {w.slots.map((s, i) => (
            <button
              key={i}
              type="button"
              disabled={play.readOnly || held === null}
              onClick={() => {
                if (held === null) return;
                play.set((p) => ({ ...p, slots: p.slots.map((x, j) => (j === i ? held : x === held ? null : x)) }));
                setHeld(null);
              }}
              aria-label={`pool slot ${i + 1}`}
              className="w-9 h-11 rounded-lg border-2 border-dashed border-sky-500 bg-sky-100/70 font-mono font-black text-2xl text-sky-900"
            >
              {s !== null && <Glyph c={text[s]} flip={w.mirror} />}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.entries(states).map(([id, st]) => (
          <Bay key={id} label={`Image ${id}`}>
            <div className="font-mono font-black text-lg tracking-wide text-slate-800">
              {st.seq.split("").map((c, i) => (
                <Glyph key={i} c={c} flip={st.flip} />
              ))}
            </div>
          </Bay>
        ))}
      </div>
      <Btn tone="slate" disabled={play.readOnly} onClick={() => play.patch({ slots: Array(text.length).fill(null) })}>
        Empty the pool
      </Btn>
    </Shell>
  );
}

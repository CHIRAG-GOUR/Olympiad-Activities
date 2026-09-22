"use client";

import React from "react";
import { Users, Trash2 } from "lucide-react";
import { ActivityShell, Stage, ToggleRow, useActivityEngine, ActivityComponentProps, optionLabel } from "./kit";
import { usePointerDrag, clamp } from "./kit/usePointerDrag";

/**
 * Q9 — Family pinboard.
 *
 * The student pins each person where they like and strings the stated relationships
 * between them. The board then infers how V relates to W from the graph the student
 * actually built, and that inference is the answer.
 */

type Rel = "sibling" | "spouse" | "parent";
interface Edge {
  a: string;
  b: string;
  rel: Rel;
}
interface PinState {
  pos: Record<string, { x: number; y: number }>;
  edges: Edge[];
  tool: Rel;
  armed: string | null;
}

const PEOPLE = [
  { id: "W", name: "W", sub: "sister of X" },
  { id: "X", name: "X", sub: "father of V, husband of T" },
  { id: "T", name: "T", sub: "wife of X" },
  { id: "V", name: "V", sub: "brother of Z (male)" },
  { id: "Z", name: "Z", sub: "sibling of V" },
];

const START: Record<string, { x: number; y: number }> = {
  W: { x: 0.16, y: 0.22 },
  X: { x: 0.46, y: 0.22 },
  T: { x: 0.78, y: 0.22 },
  V: { x: 0.38, y: 0.74 },
  Z: { x: 0.7, y: 0.74 },
};

const REL_LABEL: Record<Rel, string> = { sibling: "is a sibling of", spouse: "is married to", parent: "is a parent of" };

function inferRelation(edges: Edge[]): string | null {
  const parentOf = (p: string, c: string) => edges.some((e) => e.rel === "parent" && e.a === p && e.b === c);
  const siblings = (a: string, b: string) =>
    edges.some((e) => e.rel === "sibling" && ((e.a === a && e.b === b) || (e.a === b && e.b === a)));
  const spouses = (a: string, b: string) =>
    edges.some((e) => e.rel === "spouse" && ((e.a === a && e.b === b) || (e.a === b && e.b === a)));
  const ids = PEOPLE.map((p) => p.id);

  if (parentOf("W", "V")) return "Son";
  for (const p of ids) if (parentOf(p, "V") && siblings(p, "W")) return "Nephew";
  for (const c of ids) if (parentOf("W", c) && spouses("V", c)) return "Son-in-law";
  for (const c of ids) if (parentOf("V", c) && siblings(c, "W")) return "Uncle";
  return null;
}

export function FamilyPinboardActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<PinState>) {
  const engine = useActivityEngine<PinState, string>({
    initialState: { pos: START, edges: [], tool: "sibling", armed: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      const rel = inferRelation(s.edges);
      if (!rel) return undefined;
      const opts = question?.multipleChoiceConfig?.options || [];
      if (rel === "Son") return opts.find((o) => o.text.trim() === "Son")?.id;
      return opts.find((o) => o.text.toLowerCase().includes(rel.toLowerCase()))?.id;
    },
  });

  const s = engine.state;
  const boardRef = React.useRef<HTMLDivElement | null>(null);
  const moved = React.useRef(false);

  const { start } = usePointerDrag<string>({
    disabled: engine.readOnly,
    onStart: () => {
      moved.current = false;
    },
    onMove: (p, id) => {
      const r = boardRef.current?.getBoundingClientRect();
      if (!r) return;
      moved.current = true;
      engine.update((st) => ({
        ...st,
        pos: { ...st.pos, [id]: { x: clamp((p.x - r.left) / r.width, 0.06, 0.94), y: clamp((p.y - r.top) / r.height, 0.08, 0.92) } },
      }));
    },
  });

  const tapNode = (id: string) => {
    if (engine.readOnly || moved.current) return;
    engine.update((st) => {
      if (!st.armed) return { ...st, armed: id };
      if (st.armed === id) return { ...st, armed: null };
      const edge: Edge = { a: st.armed, b: id, rel: st.tool };
      const exists = st.edges.some((e) => e.rel === edge.rel && e.a === edge.a && e.b === edge.b);
      return { ...st, armed: null, edges: exists ? st.edges : [...st.edges, edge] };
    });
  };

  const relation = inferRelation(s.edges);

  return (
    <ActivityShell
      icon={Users}
      title="Family Relationship Pinboard"
      howTo="Drag the name pins anywhere, pick a string type, then tap two people to tie them together. The board works out how V is related to W from the family you build."
      answerText={relation ?? undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint="String the stated relationships until a path connects V back to W."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_215px]">
        <Stage label="Pinboard">
          <div
            ref={boardRef}
            className="relative h-[270px] rounded-xl bg-[repeating-linear-gradient(45deg,#fafaf9,#fafaf9_10px,#f5f5f4_10px,#f5f5f4_20px)] border border-slate-200 overflow-hidden"
            style={{ touchAction: "none" }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {s.edges.map((e, i) => {
                const a = s.pos[e.a];
                const b = s.pos[e.b];
                if (!a || !b) return null;
                const colour = e.rel === "parent" ? "#059669" : e.rel === "spouse" ? "#e11d48" : "#0284c7";
                return (
                  <g key={i}>
                    <line
                      x1={`${a.x * 100}%`}
                      y1={`${a.y * 100}%`}
                      x2={`${b.x * 100}%`}
                      y2={`${b.y * 100}%`}
                      stroke={colour}
                      strokeWidth={2.5}
                      strokeDasharray={e.rel === "sibling" ? "6 4" : undefined}
                    />
                  </g>
                );
              })}
            </svg>

            {PEOPLE.map((p) => {
              const pos = s.pos[p.id] || START[p.id];
              return (
                <button
                  key={p.id}
                  type="button"
                  onPointerDown={(e) => start(e, p.id)}
                  onClick={() => tapNode(p.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 bg-white px-2.5 py-1.5 text-left shadow-sm min-w-[64px] ${
                    s.armed === p.id ? "border-emerald-600 ring-2 ring-emerald-300" : "border-slate-300"
                  } ${engine.readOnly ? "" : "cursor-grab active:cursor-grabbing"}`}
                  style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%`, touchAction: "none" }}
                >
                  <span className="block font-black text-base text-slate-900 leading-none">{p.name}</span>
                  <span className="block text-[9px] text-slate-500 leading-tight mt-0.5">{p.sub}</span>
                </button>
              );
            })}
          </div>
        </Stage>

        <div className="space-y-2.5">
          <ToggleRow<Rel>
            label="String type — then tap two pins"
            options={[
              { id: "sibling", label: "Sibling" },
              { id: "spouse", label: "Married to" },
              { id: "parent", label: "Parent → child" },
            ]}
            value={s.tool}
            onChange={(tool) => engine.update((st) => ({ ...st, tool, armed: null }))}
            readOnly={engine.readOnly}
          />

          <div className="rounded-xl border-2 border-slate-200 bg-white p-2 space-y-1 max-h-[150px] overflow-auto">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Strings tied</div>
            {s.edges.length === 0 && <div className="text-[11px] text-slate-400 italic py-1">Nothing tied yet.</div>}
            {s.edges.map((e, i) => (
              <div key={i} className="flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-700">
                <span>
                  {e.a} {REL_LABEL[e.rel]} {e.b}
                </span>
                <button
                  type="button"
                  disabled={engine.readOnly}
                  onClick={() => engine.update((st) => ({ ...st, edges: st.edges.filter((_, j) => j !== i) }))}
                  className="w-7 h-7 grid place-items-center rounded text-slate-400 hover:bg-slate-100"
                  aria-label="Cut string"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 leading-snug">
            V is male (brother of Z), so the board names a son, nephew, uncle or son-in-law.
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

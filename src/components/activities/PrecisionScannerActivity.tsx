"use client";

import React from "react";
import { Crosshair, Check, X } from "lucide-react";
import { ActivityShell, useActivityEngine, ActivityComponentProps, optionLabel } from "./kit";
import { usePointerDrag, clamp } from "./kit/usePointerDrag";

/**
 * Q10 — Dot placement scanner.
 *
 * Each candidate figure is real geometry. The student drags two probe dots into every
 * figure, trying to satisfy both placement conditions. The figure where the placement
 * cannot be achieved is the one the scanner reports — no option clicking involved.
 */

interface Dot {
  x: number;
  y: number;
}
interface ScanState {
  dots: Record<string, { a: Dot; b: Dot }>;
  probed: Record<string, boolean>;
}

interface Figure {
  id: string;
  circle: { cx: number; cy: number; r: number };
  tri: [number, number][];
  rect: { x1: number; y1: number; x2: number; y2: number };
}

const FIGURES: Figure[] = [
  { id: "A", circle: { cx: 40, cy: 50, r: 28 }, tri: [[20, 85], [75, 15], [110, 85]], rect: { x1: 70, y1: 40, x2: 115, y2: 90 } },
  { id: "B", circle: { cx: 35, cy: 45, r: 26 }, tri: [[15, 85], [65, 12], [105, 85]], rect: { x1: 62, y1: 45, x2: 112, y2: 92 } },
  { id: "C", circle: { cx: 75, cy: 55, r: 45 }, tri: [[20, 85], [75, 15], [110, 85]], rect: { x1: 60, y1: 40, x2: 115, y2: 90 } },
  { id: "D", circle: { cx: 45, cy: 40, r: 24 }, tri: [[18, 88], [70, 14], [108, 88]], rect: { x1: 66, y1: 42, x2: 114, y2: 92 } },
];

const START: Record<string, { a: Dot; b: Dot }> = Object.fromEntries(
  FIGURES.map((f) => [f.id, { a: { x: 12, y: 12 }, b: { x: 112, y: 12 } }])
);

const inCircle = (p: Dot, c: Figure["circle"]) => Math.hypot(p.x - c.cx, p.y - c.cy) <= c.r;
const inRect = (p: Dot, r: Figure["rect"]) => p.x >= r.x1 && p.x <= r.x2 && p.y >= r.y1 && p.y <= r.y2;
function inTri(p: Dot, t: Figure["tri"]) {
  const sign = (a: number[], b: number[], c: number[]) => (a[0] - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (a[1] - c[1]);
  const pt = [p.x, p.y];
  const d1 = sign(pt, t[0], t[1]);
  const d2 = sign(pt, t[1], t[2]);
  const d3 = sign(pt, t[2], t[0]);
  const neg = d1 < 0 || d2 < 0 || d3 < 0;
  const pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}

/** Condition 1: dot in Circle AND Triangle. Condition 2: dot in Triangle AND Rectangle, outside the Circle. */
const checkFigure = (f: Figure, d: { a: Dot; b: Dot }) => ({
  a: inCircle(d.a, f.circle) && inTri(d.a, f.tri),
  b: inTri(d.b, f.tri) && inRect(d.b, f.rect) && !inCircle(d.b, f.circle),
});

export function PrecisionScannerActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<ScanState>) {
  const engine = useActivityEngine<ScanState, string>({
    initialState: { dots: START, probed: {} },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      const failing = FIGURES.filter((f) => {
        const r = checkFigure(f, s.dots[f.id] || START[f.id]);
        return !(r.a && r.b);
      });
      // Exactly one figure resists the placement, and the student has actually probed it.
      if (failing.length !== 1) return undefined;
      const fig = failing[0];
      if (!s.probed[fig.id]) return undefined;
      return question?.multipleChoiceConfig?.options.find((o) => o.text.includes(`Figure ${fig.id}`))?.id || fig.id;
    },
  });

  const svgRefs = React.useRef<Record<string, SVGSVGElement | null>>({});

  const { start } = usePointerDrag<{ fig: string; dot: "a" | "b" }>({
    disabled: engine.readOnly,
    onMove: (p, { fig, dot }) => {
      const el = svgRefs.current[fig];
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = clamp(((p.x - r.left) / r.width) * 128, 3, 125);
      const y = clamp(((p.y - r.top) / r.height) * 100, 3, 97);
      engine.update((s) => ({
        probed: { ...s.probed, [fig]: true },
        dots: { ...s.dots, [fig]: { ...(s.dots[fig] || START[fig]), [dot]: { x, y } } },
      }));
    },
  });

  const results = FIGURES.map((f) => ({ f, r: checkFigure(f, engine.state.dots[f.id] || START[f.id]) }));
  const solved = results.filter((x) => x.r.a && x.r.b).length;
  const failing = results.filter((x) => !(x.r.a && x.r.b));

  return (
    <ActivityShell
      icon={Crosshair}
      title="Dot Placement Scanner"
      howTo="Drag the blue dot into Circle ∩ Triangle and the amber dot into Triangle ∩ Rectangle (clear of the circle) in every figure. The figure that refuses both placements is your answer."
      answerText={engine.answer ? `Figure ${failing[0]?.f.id}` : undefined}
      mappedTo={optionLabel(question, engine.answer)}
      pendingHint={`${solved} of 4 figures satisfied — keep probing the rest.`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
      tools={
        <span className="flex items-center gap-2 text-[10px] font-bold">
          <span className="inline-flex items-center gap-1 text-sky-700"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Circle ∩ Triangle</span>
          <span className="inline-flex items-center gap-1 text-amber-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Triangle ∩ Rectangle</span>
        </span>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {results.map(({ f, r }) => {
          const d = engine.state.dots[f.id] || START[f.id];
          const ok = r.a && r.b;
          return (
            <div
              key={f.id}
              className={`rounded-2xl border-2 p-2 ${ok ? "border-emerald-500 bg-emerald-50" : engine.state.probed[f.id] ? "border-amber-400 bg-amber-50/50" : "border-slate-200 bg-white"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-slate-800">Figure {f.id}</span>
                {ok ? <Check className="w-4 h-4 text-emerald-600" /> : engine.state.probed[f.id] ? <X className="w-4 h-4 text-amber-600" /> : null}
              </div>
              <svg
                ref={(el) => {
                  svgRefs.current[f.id] = el;
                }}
                viewBox="0 0 128 100"
                className="w-full rounded-lg bg-white border border-slate-200"
                style={{ touchAction: "none" }}
              >
                <circle cx={f.circle.cx} cy={f.circle.cy} r={f.circle.r} fill="#0ea5e9" fillOpacity={0.08} stroke="#0284c7" strokeWidth={1.5} />
                <polygon points={f.tri.map((p) => p.join(",")).join(" ")} fill="#f59e0b" fillOpacity={0.08} stroke="#b45309" strokeWidth={1.5} />
                <rect x={f.rect.x1} y={f.rect.y1} width={f.rect.x2 - f.rect.x1} height={f.rect.y2 - f.rect.y1} fill="#64748b" fillOpacity={0.07} stroke="#475569" strokeWidth={1.5} />

                {(["a", "b"] as const).map((k) => (
                  <g key={k}>
                    <circle
                      cx={d[k].x}
                      cy={d[k].y}
                      r={11}
                      fill="transparent"
                      style={{ cursor: "grab" }}
                      onPointerDown={(e) => start(e as unknown as React.PointerEvent, { fig: f.id, dot: k })}
                    />
                    <circle
                      cx={d[k].x}
                      cy={d[k].y}
                      r={5}
                      fill={k === "a" ? "#0284c7" : "#d97706"}
                      stroke={r[k] ? "#059669" : "#ffffff"}
                      strokeWidth={2.5}
                      pointerEvents="none"
                    />
                  </g>
                ))}
              </svg>
              <div className="flex gap-1 mt-1 text-[9px] font-bold">
                <span className={r.a ? "text-emerald-700" : "text-slate-400"}>C∩T {r.a ? "✓" : "✗"}</span>
                <span className={r.b ? "text-emerald-700" : "text-slate-400"}>T∩R {r.b ? "✓" : "✗"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </ActivityShell>
  );
}

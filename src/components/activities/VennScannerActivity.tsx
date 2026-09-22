"use client";

import React from "react";
import { ScanSearch } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q3 — Venn region scanner.
 *
 * Three property latches (soldier / female / married) drive a real clipped-and-masked
 * region of the diagram. Whichever numbered region survives the student's filter is the
 * answer, so the filtering IS the answering.
 */

interface VennState {
  soldier: boolean | null;
  female: boolean | null;
  married: boolean | null;
}

const SQUARE = { x: 20, y: 60, w: 160, h: 120 };
const CIRCLE = { cx: 160, cy: 110, r: 68 };
const TRIANGLE = "120,20 40,200 240,200";

/** key = soldier/female/married as 1/0 */
const REGIONS: Record<string, { n: number; x: number; y: number; name: string }> = {
  "100": { n: 1, x: 45, y: 92, name: "Soldiers only" },
  "010": { n: 3, x: 205, y: 75, name: "Females only" },
  "001": { n: 2, x: 120, y: 48, name: "Married only" },
  "110": { n: 7, x: 168, y: 70, name: "Unmarried female soldiers" },
  "101": { n: 4, x: 70, y: 170, name: "Married male soldiers" },
  "011": { n: 9, x: 195, y: 150, name: "Married females (civilian)" },
  "111": { n: 5, x: 150, y: 140, name: "Married female soldiers" },
};

export function VennScannerActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<VennState>) {
  const engine = useActivityEngine<VennState, number>({
    initialState: { soldier: null, female: null, married: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      if (s.soldier === null || s.female === null || s.married === null) return undefined;
      const key = `${s.soldier ? 1 : 0}${s.female ? 1 : 0}${s.married ? 1 : 0}`;
      return REGIONS[key]?.n;
    },
  });

  const { soldier, female, married } = engine.state;
  const setAll = (k: keyof VennState, v: boolean) => engine.patch({ [k]: v } as Partial<VennState>);

  const included = [soldier && "S", female && "F", married && "M"].filter(Boolean) as string[];
  const excluded = [soldier === false && "S", female === false && "F", married === false && "M"].filter(Boolean) as string[];

  const shape = (id: string) => {
    if (id === "S") return <rect x={SQUARE.x} y={SQUARE.y} width={SQUARE.w} height={SQUARE.h} fill="white" />;
    if (id === "F") return <circle cx={CIRCLE.cx} cy={CIRCLE.cy} r={CIRCLE.r} fill="white" />;
    return <polygon points={TRIANGLE} fill="white" />;
  };

  // Build the highlighted region: intersect every included set, then mask out excluded sets.
  let highlight: React.ReactNode = <rect x={0} y={0} width={260} height={220} fill="#059669" opacity={0.55} />;
  if (excluded.length) {
    highlight = <g mask="url(#venn-exclude)">{highlight}</g>;
  }
  included.forEach((id) => {
    highlight = <g clipPath={`url(#venn-clip-${id})`}>{highlight}</g>;
  });

  const activeKey =
    soldier !== null && female !== null && married !== null
      ? `${soldier ? 1 : 0}${female ? 1 : 0}${married ? 1 : 0}`
      : null;
  const activeRegion = activeKey ? REGIONS[activeKey] : null;

  return (
    <ActivityShell
      icon={ScanSearch}
      title="Three-Set Venn Scanner"
      howTo="Set each property latch to YES or NO. The diagram lights up the one region that matches your filter, and that region's number becomes your answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={activeRegion ? activeRegion.name : undefined}
      pendingHint={
        activeKey && !activeRegion
          ? "That combination falls outside every numbered region — adjust a latch."
          : "Set all three latches to scan a region."
      }
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
        <Stage label="Population diagram">
          <svg viewBox="0 0 260 220" className="w-full max-w-[360px] mx-auto">
            <defs>
              <clipPath id="venn-clip-S">{shape("S")}</clipPath>
              <clipPath id="venn-clip-F">{shape("F")}</clipPath>
              <clipPath id="venn-clip-M">{shape("M")}</clipPath>
              <mask id="venn-exclude">
                <rect x={0} y={0} width={260} height={220} fill="white" />
                {excluded.map((id) => (
                  <g key={id} style={{ color: "black" }}>
                    {React.cloneElement(shape(id) as React.ReactElement<{ fill?: string }>, { fill: "black" })}
                  </g>
                ))}
              </mask>
            </defs>

            {highlight}

            <rect x={SQUARE.x} y={SQUARE.y} width={SQUARE.w} height={SQUARE.h} fill="none" stroke="#0f172a" strokeWidth={2} />
            <circle cx={CIRCLE.cx} cy={CIRCLE.cy} r={CIRCLE.r} fill="none" stroke="#0369a1" strokeWidth={2} />
            <polygon points={TRIANGLE} fill="none" stroke="#b45309" strokeWidth={2} />

            {Object.entries(REGIONS).map(([key, r]) => (
              <text
                key={key}
                x={r.x}
                y={r.y}
                textAnchor="middle"
                fontSize={13}
                fontWeight="bold"
                fill={activeKey === key ? "#064e3b" : "#475569"}
              >
                {r.n}
              </text>
            ))}
          </svg>

          <div className="flex justify-center gap-3 text-[10px] font-bold mt-1">
            <span className="text-slate-900">■ Square = Soldiers</span>
            <span className="text-sky-700">● Circle = Females</span>
            <span className="text-amber-700">▲ Triangle = Married</span>
          </div>
        </Stage>

        <div className="space-y-2">
          {([
            ["soldier", "Soldier", "Inside the square"],
            ["female", "Female", "Inside the circle"],
            ["married", "Married", "Inside the triangle"],
          ] as const).map(([k, label, sub]) => (
            <div key={k} className="rounded-xl border-2 border-slate-200 bg-white p-2">
              <div className="text-xs font-black text-slate-900">{label}</div>
              <div className="text-[10px] text-slate-500 mb-1.5">{sub}</div>
              <div className="grid grid-cols-2 gap-1.5">
                {([true, false] as const).map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    disabled={engine.readOnly}
                    onClick={() => setAll(k, v)}
                    className={`min-h-[40px] rounded-lg border-2 text-xs font-black transition ${
                      engine.state[k] === v
                        ? v
                          ? "bg-emerald-600 border-emerald-700 text-white"
                          : "bg-rose-600 border-rose-700 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {v ? "YES" : "NO"}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <ReadOut label="Region under scanner" value={activeRegion ? `#${activeRegion.n}` : "—"} tone={activeRegion ? "emerald" : "slate"} />
        </div>
      </div>
    </ActivityShell>
  );
}

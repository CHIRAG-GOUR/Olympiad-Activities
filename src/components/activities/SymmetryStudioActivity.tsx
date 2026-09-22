"use client";

import React from "react";
import { FlipHorizontal2 } from "lucide-react";
import { ActivityShell, Stage, ConnectPairs, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q20 — Mirror-line studio.
 *
 * The student spins a mirror line over each shape. When the line lands on a genuine axis
 * it locks in and the counter rises. The count discovered for a shape wires itself to the
 * matching entry in Column B, so finding the axes IS answering the matching question.
 */

interface SymState {
  angle: Record<string, number>;
  found: Record<string, number[]>;
}

const SHAPES: Record<string, { axes: number[]; art: React.ReactNode }> = {
  rect: {
    axes: [0, 90],
    art: <rect x={14} y={30} width={72} height={40} fill="#e2e8f0" stroke="#0f172a" strokeWidth={2.5} />,
  },
  arrow: {
    axes: [90],
    art: <polygon points="50,12 78,44 62,44 62,86 38,86 38,44 22,44" fill="#e2e8f0" stroke="#0f172a" strokeWidth={2.5} />,
  },
  star: {
    axes: [90, 126, 162, 18, 54],
    art: (
      <polygon
        points="50,10 61,38 91,38 67,56 76,85 50,67 24,85 33,56 9,38 39,38"
        fill="#e2e8f0"
        stroke="#0f172a"
        strokeWidth={2.5}
      />
    ),
  },
  semi: {
    axes: [90],
    art: <path d="M14 68 A 36 36 0 0 1 86 68 Z" fill="#e2e8f0" stroke="#0f172a" strokeWidth={2.5} />,
  },
};

const TOL = 7;
const norm = (a: number) => ((a % 180) + 180) % 180;

export function SymmetryStudioActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<SymState>) {
  const cfg = question?.matchingConfig;

  /** Wire each shape to the first unused Column-B entry naming the count the student found. */
  const wiring = React.useCallback(
    (found: Record<string, number[]>) => {
      if (!cfg) return [];
      const used = new Set<string>();
      const pairs: { leftId: string; rightId: string }[] = [];
      for (const left of cfg.leftItems) {
        const count = (found[left.id] || []).length;
        if (!count) continue;
        const match = cfg.rightItems.find((r) => !used.has(r.id) && Number((r.text.match(/\d+/) || [])[0]) === count);
        if (match) {
          used.add(match.id);
          pairs.push({ leftId: left.id, rightId: match.id });
        }
      }
      return pairs;
    },
    [cfg]
  );

  const engine = useActivityEngine<SymState, { leftId: string; rightId: string }[]>({
    initialState: { angle: {}, found: {} },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      const pairs = wiring(s.found);
      return cfg && pairs.length === cfg.leftItems.length ? pairs : undefined;
    },
  });

  const boxRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  const { start } = usePointerDrag<string>({
    disabled: engine.readOnly,
    onMove: (p, id) => {
      const r = boxRefs.current[id]?.getBoundingClientRect();
      if (!r) return;
      const deg = norm((Math.atan2(-(p.y - (r.top + r.height / 2)), p.x - (r.left + r.width / 2)) * 180) / Math.PI);
      engine.update((s) => {
        const shapeId = id.replace(/^.*:/, "");
        const axes = SHAPES[shapeId]?.axes || [];
        const hit = axes.find((a) => Math.min(Math.abs(norm(a) - deg), 180 - Math.abs(norm(a) - deg)) <= TOL);
        const prev = s.found[id] || [];
        return {
          angle: { ...s.angle, [id]: hit !== undefined ? norm(hit) : deg },
          found: hit !== undefined && !prev.includes(norm(hit)) ? { ...s.found, [id]: [...prev, norm(hit)] } : s.found,
        };
      });
    },
  });

  const pairs = wiring(engine.state.found);

  const MirrorBox = ({ leftId }: { leftId: string }) => {
    const key = leftId;
    const shapeId = leftId.replace(/^.*:/, "");
    const shape = SHAPES[shapeId];
    if (!shape) return null;
    const angle = engine.state.angle[key] ?? 0;
    const found = engine.state.found[key] || [];
    const locked = shape.axes.some((a) => Math.abs(norm(a) - angle) < 0.5);
    return (
      <div className="flex items-center gap-2">
        <div
          ref={(el) => {
            boxRefs.current[key] = el;
          }}
          onPointerDown={(e) => start(e, key)}
          className={`relative w-[86px] h-[86px] shrink-0 rounded-lg border-2 bg-white ${
            engine.readOnly ? "" : "cursor-grab active:cursor-grabbing"
          } ${locked ? "border-emerald-500" : "border-slate-200"}`}
          style={{ touchAction: "none" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {shape.art}
            <line
              x1={50 - 60 * Math.cos((angle * Math.PI) / 180)}
              y1={50 + 60 * Math.sin((angle * Math.PI) / 180)}
              x2={50 + 60 * Math.cos((angle * Math.PI) / 180)}
              y2={50 - 60 * Math.sin((angle * Math.PI) / 180)}
              stroke={locked ? "#059669" : "#e11d48"}
              strokeWidth={2.5}
              strokeDasharray={locked ? undefined : "5 4"}
            />
            {found.map((a) => (
              <line
                key={a}
                x1={50 - 60 * Math.cos((a * Math.PI) / 180)}
                y1={50 + 60 * Math.sin((a * Math.PI) / 180)}
                x2={50 + 60 * Math.cos((a * Math.PI) / 180)}
                y2={50 - 60 * Math.sin((a * Math.PI) / 180)}
                stroke="#059669"
                strokeWidth={1.5}
                opacity={0.55}
              />
            ))}
          </svg>
        </div>
        <div className="min-w-0">
          <div className="font-bold text-xs text-slate-900">{cfg?.leftItems.find((l) => l.id === leftId)?.text}</div>
          <div className={`text-[10px] font-mono font-bold ${found.length ? "text-emerald-700" : "text-slate-400"}`}>
            axes found: {found.length}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ActivityShell
      icon={FlipHorizontal2}
      title="Mirror Line Studio"
      howTo="Spin the red mirror line across each shape. Every time it lands on a real axis of symmetry it locks green and the counter rises — the count then wires itself to Column B."
      answerText={engine.answer ? `${pairs.length} of ${cfg?.leftItems.length} shapes measured` : undefined}
      mappedTo={engine.answer ? "Wired from the axes you found" : undefined}
      pendingHint={`Find every axis on each shape — ${pairs.length} of ${cfg?.leftItems.length ?? 4} wired.`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <Stage label={cfg?.instruction || "Find the axes, then read the wiring"}>
        <ConnectPairs
          left={(cfg?.leftItems || []).map((l) => ({
            id: l.id,
            text: l.text,
            autoLinkTo: null,
            body: <MirrorBox leftId={l.id} />,
          }))}
          right={(cfg?.rightItems || []).map((r) => ({ id: r.id, text: r.text.replace(/\s*\(.*\)$/, "") }))}
          pairs={pairs}
          onChange={() => undefined}
          readOnly
          leftTitle="Spin the mirror line"
          rightTitle="Lines of symmetry"
        />
      </Stage>
    </ActivityShell>
  );
}

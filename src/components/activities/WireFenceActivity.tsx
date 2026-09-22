"use client";

import React from "react";
import { Fence } from "lucide-react";
import { ActivityShell, Stage, ReadOut, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag, clamp } from "./kit/usePointerDrag";

/**
 * Q29 — Bendable wire fence.
 *
 * A 180 m wire the student bends by dragging the rectangle's corner. The perimeter is
 * physically conserved, so the breadth follows the length, and the enclosed area the
 * student ends up with is the answer.
 */

interface FenceState {
  length: number | null;
}

const PERIMETER = 180;

export function WireFenceActivity({ value, activityState, onChange, readOnly }: ActivityComponentProps<FenceState>) {
  const engine = useActivityEngine<FenceState, number>({
    initialState: { length: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => (s.length === null ? undefined : s.length * (PERIMETER / 2 - s.length)),
  });

  const boxRef = React.useRef<HTMLDivElement | null>(null);

  const { start } = usePointerDrag({
    disabled: engine.readOnly,
    onStart: (p) => setFromPointer(p.x),
    onMove: (p) => setFromPointer(p.x),
  });

  function setFromPointer(clientX: number) {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    const frac = clamp((clientX - r.left) / r.width, 0.06, 0.96);
    engine.update({ length: Math.round(frac * 88) });
  }

  const L = engine.state.length;
  const B = L === null ? null : PERIMETER / 2 - L;
  const halfRatio = L !== null && B !== null && Math.abs(B - L / 2) < 0.5;

  return (
    <ActivityShell
      icon={Fence}
      title="Bendable Wire Fence"
      howTo="Drag the corner handle to bend the 180 m wire into different rectangles. The breadth adjusts automatically to keep the perimeter at 180 m — the area you enclose is your answer."
      answerText={engine.answer !== undefined ? String(engine.answer) : undefined}
      mappedTo={engine.answer !== undefined ? `${L} m × ${B} m` : undefined}
      pendingHint="Drag the corner handle to bend the wire."
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_190px]">
        <Stage label="Wire plot — perimeter locked at 180 m">
          <div
            ref={boxRef}
            onPointerDown={(e) => start(e, undefined)}
            className="relative h-[210px] rounded-lg bg-white border border-slate-200 cursor-ew-resize overflow-hidden"
            style={{ touchAction: "none" }}
          >
            {L !== null && B !== null && (
              <>
                <div
                  className={`absolute left-4 bottom-4 border-4 ${halfRatio ? "border-emerald-600 bg-emerald-50" : "border-sky-600 bg-sky-50"}`}
                  style={{ width: `${(L / 88) * 88}%`, height: `${(B / 88) * 88}%` }}
                />
                <span className="absolute bottom-0 left-4 text-[10px] font-mono font-black text-slate-700" style={{ width: `${(L / 88) * 88}%`, textAlign: "center" }}>
                  length {L} m
                </span>
                <span className="absolute left-0 bottom-4 text-[10px] font-mono font-black text-slate-700 origin-bottom-left -rotate-90 translate-y-2">
                  breadth {B} m
                </span>
                <div
                  className="absolute w-5 h-5 rounded-full bg-white border-4 border-emerald-600 -translate-x-1/2 translate-y-1/2"
                  style={{ left: `calc(1rem + ${(L / 88) * 88}%)`, bottom: `calc(1rem + ${(B / 88) * 88}%)` }}
                />
              </>
            )}
            {L === null && (
              <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-slate-400">
                Drag anywhere to bend the wire
              </div>
            )}
          </div>
        </Stage>

        <div className="space-y-2">
          <ReadOut label="Length" value={L === null ? "—" : `${L} m`} />
          <ReadOut label="Breadth" value={B === null ? "—" : `${B} m`} tone={halfRatio ? "emerald" : "slate"} />
          <ReadOut label="Perimeter" value={L === null ? "—" : `${2 * (L + (B as number))} m`} />
          <ReadOut label="Area enclosed" value={engine.answer === undefined ? "—" : `${engine.answer} sq. m`} tone={engine.answer !== undefined ? "emerald" : "slate"} />
          <p className={`text-[10px] leading-snug ${halfRatio ? "text-emerald-700 font-bold" : "text-slate-500"}`}>
            {halfRatio ? "The breadth is now exactly half the length." : "Bend it until the breadth is half the length."}
          </p>
        </div>
      </div>
    </ActivityShell>
  );
}

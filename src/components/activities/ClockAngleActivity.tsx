"use client";

import React from "react";
import { Clock } from "lucide-react";
import { ActivityShell, Stage, ConnectPairs, useActivityEngine, ActivityComponentProps } from "./kit";
import { usePointerDrag } from "./kit/usePointerDrag";

/**
 * Q25 — Clock angle bench.
 *
 * Every clock has two hands the student drags. The angle between the hands is measured off
 * the positions the student sets, and that measurement wires itself to the matching entry
 * in Column B — so setting the clocks IS answering the question.
 */

interface ClockState {
  hands: Record<string, { hour: number; minute: number }>;
}

const TARGET: Record<string, { h: number; m: number }> = {
  t_400: { h: 4, m: 0 },
  t_700: { h: 7, m: 0 },
  t_800: { h: 8, m: 0 },
  t_300: { h: 3, m: 0 },
};

const DEFAULT = { hour: 0, minute: 0 };
const smallerAngle = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return Math.round(d > 180 ? 360 - d : d);
};

export function ClockAngleActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<ClockState>) {
  const cfg = question?.matchingConfig;

  const wiring = React.useCallback(
    (hands: Record<string, { hour: number; minute: number }>) => {
      if (!cfg) return [];
      const used = new Set<string>();
      const pairs: { leftId: string; rightId: string }[] = [];
      for (const left of cfg.leftItems) {
        const h = hands[left.id];
        const target = TARGET[left.id];
        if (!h || !target) continue;
        // The hands must actually be set to the stated time before a reading is taken
        if (h.hour !== target.h % 12 || h.minute !== target.m) continue;
        const angle = smallerAngle(h.hour * 30 + h.minute * 0.5, h.minute * 6);
        const match = cfg.rightItems.find((r) => !used.has(r.id) && Number((r.text.match(/\d+/) || [])[0]) === angle);
        if (match) {
          used.add(match.id);
          pairs.push({ leftId: left.id, rightId: match.id });
        }
      }
      return pairs;
    },
    [cfg]
  );

  const engine = useActivityEngine<ClockState, { leftId: string; rightId: string }[]>({
    initialState: { hands: {} },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      const pairs = wiring(s.hands);
      return cfg && pairs.length === cfg.leftItems.length ? pairs : undefined;
    },
  });

  const faceRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  const { start } = usePointerDrag<{ id: string; hand: "hour" | "minute" }>({
    disabled: engine.readOnly,
    onMove: (p, { id, hand }) => {
      const r = faceRefs.current[id]?.getBoundingClientRect();
      if (!r) return;
      const deg = (((Math.atan2(p.x - (r.left + r.width / 2), -(p.y - (r.top + r.height / 2))) * 180) / Math.PI) + 360) % 360;
      engine.update((s) => {
        const prev = s.hands[id] || DEFAULT;
        const next =
          hand === "hour"
            ? { ...prev, hour: Math.round(deg / 30) % 12 }
            : { ...prev, minute: Math.round(deg / 6) % 60 };
        return { hands: { ...s.hands, [id]: next } };
      });
    },
  });

  const pairs = wiring(engine.state.hands);

  const Face = ({ id, label }: { id: string; label: string }) => {
    const h = engine.state.hands[id] || DEFAULT;
    const target = TARGET[id];
    const set = target && h.hour === target.h % 12 && h.minute === target.m;
    const hourDeg = h.hour * 30 + h.minute * 0.5;
    const minDeg = h.minute * 6;
    const angle = smallerAngle(hourDeg, minDeg);
    const pt = (deg: number, len: number) => ({
      x: 50 + len * Math.sin((deg * Math.PI) / 180),
      y: 50 - len * Math.cos((deg * Math.PI) / 180),
    });
    const hp = pt(hourDeg, 24);
    const mp = pt(minDeg, 34);
    return (
      <div className="flex items-center gap-2">
        <div
          ref={(el) => {
            faceRefs.current[id] = el;
          }}
          className={`relative w-[86px] h-[86px] shrink-0 rounded-full border-2 bg-white ${set ? "border-emerald-500" : "border-slate-300"}`}
          style={{ touchAction: "none" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {[0, 3, 6, 9].map((n) => {
              const p = pt(n * 30, 40);
              return (
                <text key={n} x={p.x} y={p.y + 3} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#94a3b8">
                  {n === 0 ? 12 : n}
                </text>
              );
            })}
            <line x1={50} y1={50} x2={mp.x} y2={mp.y} stroke="#0284c7" strokeWidth={3} strokeLinecap="round" />
            <line x1={50} y1={50} x2={hp.x} y2={hp.y} stroke="#e11d48" strokeWidth={4} strokeLinecap="round" />
            <circle cx={50} cy={50} r={3.5} fill="#0f172a" />
            <circle cx={mp.x} cy={mp.y} r={10} fill="transparent" style={{ cursor: "grab" }} onPointerDown={(e) => start(e as unknown as React.PointerEvent, { id, hand: "minute" })} />
            <circle cx={hp.x} cy={hp.y} r={10} fill="transparent" style={{ cursor: "grab" }} onPointerDown={(e) => start(e as unknown as React.PointerEvent, { id, hand: "hour" })} />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="font-bold text-xs text-slate-900">Set the hands to {label}</div>
          <div className={`text-[10px] font-mono font-bold ${set ? "text-emerald-700" : "text-slate-400"}`}>
            showing {String(h.hour === 0 ? 12 : h.hour).padStart(2, "0")}:{String(h.minute).padStart(2, "0")}
            {set ? ` · angle ${angle}°` : ""}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ActivityShell
      icon={Clock}
      title="Clock Angle Bench"
      howTo="Drag the red hour hand and blue minute hand on each clock to the time written beside it. The bench measures the angle between them and wires it to Column B."
      answerText={engine.answer ? `${pairs.length} of ${cfg?.leftItems.length} clocks measured` : undefined}
      mappedTo={engine.answer ? "Wired from the hands you set" : undefined}
      pendingHint={`Set every clock to its stated time — ${pairs.length} of ${cfg?.leftItems.length ?? 4} measured.`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <Stage label={cfg?.instruction || "Set the clocks, then read the wiring"}>
        <ConnectPairs
          left={(cfg?.leftItems || []).map((l) => ({
            id: l.id,
            text: l.text,
            autoLinkTo: null,
            body: <Face id={l.id} label={l.text} />,
          }))}
          right={(cfg?.rightItems || []).map((r) => ({ id: r.id, text: r.text }))}
          pairs={pairs}
          onChange={() => undefined}
          readOnly
          leftTitle="Set each clock"
          rightTitle="Measured angle"
        />
      </Stage>
    </ActivityShell>
  );
}

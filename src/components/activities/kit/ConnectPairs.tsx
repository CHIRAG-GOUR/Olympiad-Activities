"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { usePointerDrag } from "./usePointerDrag";

export interface PairNode {
  id: string;
  text: string;
  sub?: string;
  /** Rendered instead of plain text — e.g. a live mini-simulation that derives the link */
  body?: React.ReactNode;
  /** When set, the row is wired automatically by the microworld rather than by hand */
  autoLinkTo?: string | null;
}

interface ConnectPairsProps {
  left: PairNode[];
  right: PairNode[];
  pairs: { leftId: string; rightId: string }[];
  onChange: (pairs: { leftId: string; rightId: string }[]) => void;
  readOnly?: boolean;
  leftTitle?: string;
  rightTitle?: string;
  /** One right node can serve many left nodes */
  allowReuse?: boolean;
}

/**
 * Connect Column A to Column B by dragging from a node's anchor, or by tapping a left
 * node then a right node. Live SVG wires track layout changes.
 */
export function ConnectPairs({
  left,
  right,
  pairs,
  onChange,
  readOnly = false,
  leftTitle = "Column A",
  rightTitle = "Column B",
  allowReuse = false,
}: ConnectPairsProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const anchors = useRef<Record<string, HTMLElement | null>>({});
  const [, force] = useState(0);
  const [armed, setArmed] = useState<string | null>(null);
  const [ghost, setGhost] = useState<{ x: number; y: number } | null>(null);

  const relayout = useCallback(() => force((n) => n + 1), []);

  useLayoutEffect(relayout, [pairs, left, right, relayout]);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(relayout);
    ro.observe(el);
    window.addEventListener("resize", relayout);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", relayout);
    };
  }, [relayout]);

  const anchorPoint = (id: string, side: "left" | "right") => {
    const el = anchors.current[`${side}:${id}`];
    const wrap = wrapRef.current;
    if (!el || !wrap) return null;
    const r = el.getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    return { x: r.left - w.left + r.width / 2, y: r.top - w.top + r.height / 2 };
  };

  const rightAt = (x: number, y: number) => {
    for (const n of right) {
      const el = anchors.current[`row:${n.id}`];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return n.id;
    }
    return null;
  };

  const connect = (leftId: string, rightId: string) => {
    if (readOnly) return;
    const next = pairs.filter((p) => p.leftId !== leftId && (allowReuse || p.rightId !== rightId));
    next.push({ leftId, rightId });
    onChange(next);
  };

  const { start } = usePointerDrag<string>({
    disabled: readOnly,
    onMove: (p) => {
      const w = wrapRef.current?.getBoundingClientRect();
      if (w) setGhost({ x: p.x - w.left, y: p.y - w.top });
    },
    onEnd: (p, leftId) => {
      setGhost(null);
      const target = rightAt(p.x, p.y);
      if (target) connect(leftId, target);
    },
  });

  const Anchor = ({ id, side }: { id: string; side: "left" | "right" }) => (
    <span
      ref={(el) => {
        anchors.current[`${side}:${id}`] = el;
      }}
      className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${
        pairs.some((p) => (side === "left" ? p.leftId : p.rightId) === id)
          ? "bg-emerald-500 border-emerald-700"
          : "bg-white border-slate-400"
      }`}
    />
  );

  const Column = ({ nodes, side }: { nodes: PairNode[]; side: "left" | "right" }) => (
    <div className="space-y-2">
      {nodes.map((n) => {
        const linked = pairs.some((p) => (side === "left" ? p.leftId : p.rightId) === n.id);
        const auto = side === "left" && n.autoLinkTo !== undefined;
        return (
          <div
            key={n.id}
            ref={(el) => {
              anchors.current[`row:${n.id}`] = el;
            }}
            onPointerDown={(e) => {
              if (side === "left" && !auto) start(e, n.id);
            }}
            onClick={() => {
              if (readOnly) return;
              if (side === "left" && !auto) setArmed((a) => (a === n.id ? null : n.id));
              else if (side === "right" && armed) {
                connect(armed, n.id);
                setArmed(null);
              }
            }}
            className={`flex items-center gap-2 rounded-xl border-2 bg-white px-2.5 py-2 min-h-[48px] transition-all ${
              armed === n.id
                ? "border-emerald-600 ring-2 ring-emerald-300"
                : linked
                ? "border-emerald-400"
                : "border-slate-200"
            } ${side === "left" && !auto && !readOnly ? "cursor-grab active:cursor-grabbing" : ""} ${
              side === "right" && armed ? "cursor-pointer hover:border-emerald-500" : ""
            }`}
            style={{ touchAction: "none" }}
          >
            {side === "right" && <Anchor id={n.id} side="right" />}
            <div className="min-w-0 flex-1">
              {n.body ?? (
                <>
                  <div className="font-bold text-xs text-slate-900 leading-tight">{n.text}</div>
                  {n.sub && <div className="text-[10px] text-slate-500 font-mono">{n.sub}</div>}
                </>
              )}
            </div>
            {side === "left" && linked && !readOnly && !auto && (
              <button
                type="button"
                aria-label="Remove link"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(pairs.filter((p) => p.leftId !== n.id));
                }}
                className="w-7 h-7 grid place-items-center rounded-md text-slate-400 hover:bg-slate-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {side === "left" && <Anchor id={n.id} side="left" />}
          </div>
        );
      })}
    </div>
  );

  return (
    <div ref={wrapRef} className="relative">
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" aria-hidden>
        {pairs.map((p) => {
          const a = anchorPoint(p.leftId, "left");
          const b = anchorPoint(p.rightId, "right");
          if (!a || !b) return null;
          const mid = (a.x + b.x) / 2;
          return (
            <path
              key={`${p.leftId}-${p.rightId}`}
              d={`M ${a.x} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${b.x} ${b.y}`}
              stroke="#059669"
              strokeWidth={2.5}
              fill="none"
            />
          );
        })}
        {ghost && (
          <circle cx={ghost.x} cy={ghost.y} r={4} fill="#059669" />
        )}
      </svg>

      <div className="grid grid-cols-2 gap-6 sm:gap-10">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">{leftTitle}</div>
          <Column nodes={left} side="left" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">{rightTitle}</div>
          <Column nodes={right} side="right" />
        </div>
      </div>
    </div>
  );
}

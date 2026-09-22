"use client";

import React, { useRef } from "react";
import { usePointerDrag, clamp } from "./usePointerDrag";

export interface BoardPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
  color?: string;
  draggable?: boolean;
  radius?: number;
}

export interface BoardSegment {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
  dashed?: boolean;
  width?: number;
}

interface CoordinateBoardProps {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  points: BoardPoint[];
  segments?: BoardSegment[];
  /** Extra SVG drawn under the points, in board coordinates via `toPx` */
  children?: (toPx: (x: number, y: number) => { x: number; y: number }) => React.ReactNode;
  onDragPoint?: (id: string, x: number, y: number) => void;
  /** Click anywhere on the plane to place / move a point */
  onPlace?: (x: number, y: number) => void;
  snap?: number;
  readOnly?: boolean;
  height?: number;
  showGrid?: boolean;
  axisLabels?: boolean;
}

/**
 * A real, draggable coordinate plane. Points are moved with mouse or finger and snap to
 * the grid; the resulting coordinates are what the activity turns into an answer.
 */
export function CoordinateBoard({
  minX,
  maxX,
  minY,
  maxY,
  points,
  segments = [],
  children,
  onDragPoint,
  onPlace,
  snap = 1,
  readOnly = false,
  height = 260,
  showGrid = true,
  axisLabels = true,
}: CoordinateBoardProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pad = 26;
  const W = 420;
  const H = height;
  const spanX = maxX - minX;
  const spanY = maxY - minY;

  const toPx = (x: number, y: number) => ({
    x: pad + ((x - minX) / spanX) * (W - pad * 2),
    y: H - pad - ((y - minY) / spanY) * (H - pad * 2),
  });

  const toBoard = (clientX: number, clientY: number) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return null;
    const px = ((clientX - r.left) / r.width) * W;
    const py = ((clientY - r.top) / r.height) * H;
    const x = minX + ((px - pad) / (W - pad * 2)) * spanX;
    const y = minY + ((H - pad - py) / (H - pad * 2)) * spanY;
    const sn = (v: number) => (snap ? Math.round(v / snap) * snap : v);
    return { x: clamp(sn(x), minX, maxX), y: clamp(sn(y), minY, maxY) };
  };

  const { start } = usePointerDrag<string>({
    disabled: readOnly || !onDragPoint,
    onMove: (p, id) => {
      const b = toBoard(p.x, p.y);
      if (b) onDragPoint?.(id, b.x, b.y);
    },
  });

  const ticksX: number[] = [];
  for (let v = Math.ceil(minX); v <= maxX; v++) ticksX.push(v);
  const ticksY: number[] = [];
  for (let v = Math.ceil(minY); v <= maxY; v++) ticksY.push(v);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full rounded-xl bg-white border-2 border-slate-200"
      style={{ touchAction: "none" }}
      onPointerDown={(e) => {
        if (readOnly || !onPlace) return;
        const b = toBoard(e.clientX, e.clientY);
        if (b) onPlace(b.x, b.y);
      }}
    >
      {showGrid && (
        <g>
          {ticksX.map((v) => (
            <line key={`gx${v}`} x1={toPx(v, minY).x} y1={pad} x2={toPx(v, minY).x} y2={H - pad} stroke="#e2e8f0" strokeWidth={1} />
          ))}
          {ticksY.map((v) => (
            <line key={`gy${v}`} x1={pad} y1={toPx(minX, v).y} x2={W - pad} y2={toPx(minX, v).y} stroke="#e2e8f0" strokeWidth={1} />
          ))}
        </g>
      )}

      {/* Axes */}
      <line x1={pad} y1={toPx(minX, clamp(0, minY, maxY)).y} x2={W - pad} y2={toPx(minX, clamp(0, minY, maxY)).y} stroke="#94a3b8" strokeWidth={2} />
      <line x1={toPx(clamp(0, minX, maxX), minY).x} y1={pad} x2={toPx(clamp(0, minX, maxX), minY).x} y2={H - pad} stroke="#94a3b8" strokeWidth={2} />

      {axisLabels &&
        ticksX
          .filter((v) => v % Math.max(1, Math.round(spanX / 10)) === 0)
          .map((v) => (
            <text key={`tx${v}`} x={toPx(v, clamp(0, minY, maxY)).x} y={toPx(v, clamp(0, minY, maxY)).y + 13} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="monospace">
              {v}
            </text>
          ))}
      {axisLabels &&
        ticksY
          .filter((v) => v !== 0 && v % Math.max(1, Math.round(spanY / 10)) === 0)
          .map((v) => (
            <text key={`ty${v}`} x={toPx(clamp(0, minX, maxX), v).x - 7} y={toPx(clamp(0, minX, maxX), v).y + 3} textAnchor="end" fontSize={9} fill="#64748b" fontFamily="monospace">
              {v}
            </text>
          ))}

      {children?.(toPx)}

      {segments.map((s, i) => {
        const a = toPx(s.from.x, s.from.y);
        const b = toPx(s.to.x, s.to.y);
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={s.color || "#0ea5e9"}
            strokeWidth={s.width || 2.5}
            strokeDasharray={s.dashed ? "5 4" : undefined}
            strokeLinecap="round"
          />
        );
      })}

      {points.map((p) => {
        const c = toPx(p.x, p.y);
        const canDrag = p.draggable !== false && !readOnly && !!onDragPoint;
        return (
          <g key={p.id}>
            {canDrag && <circle cx={c.x} cy={c.y} r={18} fill="transparent" onPointerDown={(e) => { e.stopPropagation(); start(e as unknown as React.PointerEvent, p.id); }} style={{ cursor: "grab" }} />}
            <circle cx={c.x} cy={c.y} r={p.radius || 7} fill={p.color || "#059669"} stroke="#fff" strokeWidth={2.5} pointerEvents="none" />
            {p.label && (
              <text x={c.x + 11} y={c.y - 9} fontSize={11} fontWeight="bold" fill="#0f172a" pointerEvents="none">
                {p.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

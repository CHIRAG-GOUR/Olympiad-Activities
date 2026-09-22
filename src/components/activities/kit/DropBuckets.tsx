"use client";

import React, { useRef, useState } from "react";
import { Undo2 } from "lucide-react";
import { usePointerDrag } from "./usePointerDrag";

export interface BucketItem {
  id: string;
  text: string;
  sub?: string;
  visual?: React.ReactNode;
}

export interface Bucket {
  id: string;
  title: string;
  hint?: string;
}

interface DropBucketsProps {
  items: BucketItem[];
  buckets: Bucket[];
  /** itemId -> bucketId */
  assignment: Record<string, string>;
  onAssign: (itemId: string, bucketId: string | null) => void;
  readOnly?: boolean;
  trayLabel?: string;
  columns?: number;
}

/**
 * Drag items into category buckets. Works with mouse and touch drags, and also with a
 * tap-item-then-tap-bucket fallback so it is usable on any device.
 */
export function DropBuckets({
  items,
  buckets,
  assignment,
  onAssign,
  readOnly = false,
  trayLabel = "Drag each card into a bucket",
  columns,
}: DropBucketsProps) {
  const bucketRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [armed, setArmed] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const bucketAt = (x: number, y: number) => {
    for (const b of buckets) {
      const el = bucketRefs.current[b.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return b.id;
    }
    return null;
  };

  const { start } = usePointerDrag<string>({
    disabled: readOnly,
    onStart: (p, id) => setDrag({ id, x: p.x, y: p.y }),
    onMove: (p, id) => {
      setDrag({ id, x: p.x, y: p.y });
      setHover(bucketAt(p.x, p.y));
    },
    onEnd: (p, id) => {
      const target = bucketAt(p.x, p.y);
      setDrag(null);
      setHover(null);
      if (target) onAssign(id, target);
      else setArmed((a) => (a === id ? null : id));
    },
  });

  const tray = items.filter((i) => !assignment[i.id]);

  const Card = ({ item, inBucket }: { item: BucketItem; inBucket: boolean }) => (
    <div
      onPointerDown={(e) => start(e, item.id)}
      onClick={() => !readOnly && setArmed((a) => (a === item.id ? null : item.id))}
      className={`flex items-center gap-2 rounded-xl border-2 bg-white px-2.5 py-2 min-h-[44px] text-left transition-all ${
        drag?.id === item.id ? "opacity-30" : ""
      } ${
        armed === item.id
          ? "border-emerald-600 ring-2 ring-emerald-300"
          : inBucket
          ? "border-emerald-300"
          : "border-slate-300 hover:border-emerald-400"
      } ${readOnly ? "" : "cursor-grab active:cursor-grabbing"}`}
      style={{ touchAction: "none" }}
    >
      {item.visual && <div className="shrink-0">{item.visual}</div>}
      <div className="min-w-0">
        <div className="font-bold text-xs text-slate-900 leading-tight">{item.text}</div>
        {item.sub && <div className="text-[10px] text-slate-500 font-mono">{item.sub}</div>}
      </div>
      {inBucket && !readOnly && (
        <button
          type="button"
          aria-label="Return to tray"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onAssign(item.id, null);
          }}
          className="ml-auto w-7 h-7 grid place-items-center rounded-md hover:bg-slate-100 text-slate-400"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          {trayLabel} {armed && <span className="text-emerald-700">— now tap a bucket</span>}
        </div>
        {tray.length ? (
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns || Math.min(3, tray.length)}, minmax(0,1fr))` }}>
            {tray.map((item) => (
              <Card key={item.id} item={item} inBucket={false} />
            ))}
          </div>
        ) : (
          <div className="text-xs font-semibold text-emerald-700 py-1">All cards placed.</div>
        )}
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(buckets.length, 3)}, minmax(0,1fr))` }}>
        {buckets.map((b) => {
          const contents = items.filter((i) => assignment[i.id] === b.id);
          return (
            <div
              key={b.id}
              ref={(el) => {
                bucketRefs.current[b.id] = el;
              }}
              onClick={() => {
                if (armed && !readOnly) {
                  onAssign(armed, b.id);
                  setArmed(null);
                }
              }}
              className={`rounded-2xl border-2 p-2.5 min-h-[120px] transition-colors ${
                hover === b.id || (armed && !readOnly)
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-300 bg-white"
              }`}
            >
              <div className="font-black text-xs text-slate-800 mb-2 leading-tight">{b.title}</div>
              {b.hint && <div className="text-[10px] text-slate-500 mb-2">{b.hint}</div>}
              <div className="space-y-1.5">
                {contents.map((item) => (
                  <Card key={item.id} item={item} inBucket />
                ))}
                {!contents.length && (
                  <div className="text-[11px] text-slate-400 italic py-3 text-center">Drop here</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {drag && (
        <div
          className="pointer-events-none fixed z-50 rounded-xl border-2 border-emerald-600 bg-white px-2.5 py-2 shadow-xl text-xs font-bold text-slate-900"
          style={{ left: drag.x + 10, top: drag.y + 10 }}
        >
          {items.find((i) => i.id === drag.id)?.text}
        </div>
      )}
    </div>
  );
}

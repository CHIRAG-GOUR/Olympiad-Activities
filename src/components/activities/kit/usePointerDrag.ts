"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export interface DragPoint {
  x: number;
  y: number;
  dx: number;
  dy: number;
  /** Position relative to the element the gesture started on */
  localX: number;
  localY: number;
  /** 0..1 within the originating element */
  fracX: number;
  fracY: number;
}

interface DragHandlers<T> {
  onStart?: (p: DragPoint, payload: T) => void;
  onMove?: (p: DragPoint, payload: T) => void;
  onEnd?: (p: DragPoint, payload: T) => void;
  disabled?: boolean;
}

/**
 * Unified mouse + touch + pen dragging. Listeners live on window while the gesture is
 * active and are always torn down on unmount, so nothing leaks when a question unmounts.
 */
export function usePointerDrag<T = undefined>(handlers: DragHandlers<T>) {
  const ref = useRef(handlers);
  ref.current = handlers;

  const [dragging, setDragging] = useState(false);
  const session = useRef<{
    rect: DOMRect;
    startX: number;
    startY: number;
    payload: T;
  } | null>(null);
  const cleanup = useRef<() => void>(() => {});

  useEffect(() => () => cleanup.current(), []);

  const toPoint = useCallback((clientX: number, clientY: number): DragPoint => {
    const s = session.current!;
    const localX = clientX - s.rect.left;
    const localY = clientY - s.rect.top;
    return {
      x: clientX,
      y: clientY,
      dx: clientX - s.startX,
      dy: clientY - s.startY,
      localX,
      localY,
      fracX: s.rect.width ? Math.min(1, Math.max(0, localX / s.rect.width)) : 0,
      fracY: s.rect.height ? Math.min(1, Math.max(0, localY / s.rect.height)) : 0,
    };
  }, []);

  const start = useCallback(
    (e: React.PointerEvent, payload: T) => {
      if (ref.current.disabled) return;
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      session.current = { rect, startX: e.clientX, startY: e.clientY, payload };
      setDragging(true);
      ref.current.onStart?.(toPoint(e.clientX, e.clientY), payload);

      const move = (ev: PointerEvent) => {
        if (!session.current) return;
        ev.preventDefault();
        ref.current.onMove?.(toPoint(ev.clientX, ev.clientY), session.current.payload);
      };
      const end = (ev: PointerEvent) => {
        if (!session.current) return;
        ref.current.onEnd?.(toPoint(ev.clientX, ev.clientY), session.current.payload);
        session.current = null;
        setDragging(false);
        cleanup.current();
      };
      cleanup.current = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
        cleanup.current = () => {};
      };
      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
    },
    [toPoint]
  );

  return { dragging, start };
}

/** Measure a ref'd element, keeping the measurement fresh across resizes. */
export function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setRect(el.getBoundingClientRect());
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return { ref, rect };
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InteractiveActivity } from "./types";

export interface ActivityEngineConfig<S, A> {
  /** Pristine microworld state */
  initialState: S | (() => S);
  /** Pure function turning interaction state into the submitted answer. undefined => not answerable yet */
  resolve: (state: S) => A | undefined;
  /** Persisted microworld state from a previous visit */
  activityState?: S;
  /** Persisted answer (used only if no microworld state survived) */
  value?: any;
  /** Best-effort reconstruction of the microworld from a bare answer */
  deriveStateFromValue?: (value: any) => S | undefined;
  onChange: (answer: A | undefined, state?: S) => void;
  readOnly?: boolean;
}

export interface ActivityEngine<S, A> extends InteractiveActivity<S, A> {
  state: S;
  answer: A | undefined;
  valid: boolean;
  readOnly: boolean;
  /** Apply a new state (or updater) and publish the freshly resolved answer */
  update: (next: S | ((prev: S) => S)) => void;
  /** Shallow-merge into an object state and publish */
  patch: (partial: Partial<S>) => void;
}

const resolveInitial = <S,>(init: S | (() => S)): S =>
  typeof init === "function" ? (init as () => S)() : init;

/**
 * Single source of truth for every activity: holds the microworld state, derives the
 * answer from it, pushes both upward, and supports restore / reset / validity.
 */
export function useActivityEngine<S, A = unknown>(
  config: ActivityEngineConfig<S, A>
): ActivityEngine<S, A> {
  const { initialState, resolve, activityState, value, deriveStateFromValue, onChange, readOnly = false } = config;

  const initialRef = useRef<S>(resolveInitial(initialState));
  const resolveRef = useRef(resolve);
  resolveRef.current = resolve;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [state, setState] = useState<S>(() => {
    if (activityState !== undefined && activityState !== null) return activityState;
    if (value !== undefined && value !== null && deriveStateFromValue) {
      const derived = deriveStateFromValue(value);
      if (derived !== undefined) return derived;
    }
    return initialRef.current;
  });

  // Rehydrate when an externally restored microworld state arrives (crash recovery, resume),
  // and rewind to pristine when the session clears this question's response.
  const lastExternal = useRef(activityState);
  useEffect(() => {
    if (activityState === lastExternal.current) return;
    lastExternal.current = activityState;
    setState(activityState === undefined || activityState === null ? initialRef.current : activityState);
  }, [activityState]);

  const answer = useMemo(() => resolveRef.current(state), [state]);

  const update = useCallback(
    (next: S | ((prev: S) => S)) => {
      if (readOnly) return;
      setState((prev) => {
        const value = typeof next === "function" ? (next as (p: S) => S)(prev) : next;
        const resolved = resolveRef.current(value);
        onChangeRef.current(resolved, value);
        return value;
      });
    },
    [readOnly]
  );

  const patch = useCallback(
    (partial: Partial<S>) => update((prev) => ({ ...(prev as object), ...(partial as object) } as S)),
    [update]
  );

  const reset = useCallback(() => {
    if (readOnly) return;
    setState(initialRef.current);
    onChangeRef.current(undefined, undefined);
  }, [readOnly]);

  const restoreState = useCallback((next: S) => setState(next), []);

  return {
    state,
    answer,
    valid: answer !== undefined,
    readOnly,
    update,
    patch,
    reset,
    restoreState,
    getAnswer: () => resolveRef.current(state),
    getState: () => state,
    isValid: () => resolveRef.current(state) !== undefined,
  };
}

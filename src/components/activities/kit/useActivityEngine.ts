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
 * Whether a persisted state still looks like the state this activity builds.
 *
 * Sessions outlive code. A paper can be rebuilt and an activity replaced while a
 * candidate's saved session still holds the previous generation's state — and feeding
 * that into a component that cannot read it throws during render, which takes down the
 * whole exam page rather than just one question. Anything that does not match the
 * pristine shape is discarded in favour of a clean start.
 */
function matchesShape(restored: unknown, pristine: unknown): boolean {
  if (pristine === null || typeof pristine !== "object") {
    return restored !== undefined && restored !== null && typeof restored === typeof pristine;
  }
  if (restored === null || typeof restored !== "object") return false;
  if (Array.isArray(pristine) !== Array.isArray(restored)) return false;
  if (Array.isArray(pristine)) return true;
  // Every field the activity expects must be present; extra fields are harmless.
  return Object.keys(pristine as object).every((k) => k in (restored as object));
}

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
    if (
      activityState !== undefined &&
      activityState !== null &&
      matchesShape(activityState, initialRef.current)
    ) {
      return activityState;
    }
    if (value !== undefined && value !== null && deriveStateFromValue) {
      const derived = deriveStateFromValue(value);
      if (derived !== undefined) return derived;
    }
    return initialRef.current;
  });

  // Always-current mirror of `state`, so `update` can read/write it synchronously without
  // going through a setState updater callback (see below for why that matters).
  const stateRef = useRef(state);
  stateRef.current = state;

  // Rehydrate when an externally restored microworld state arrives (crash recovery, resume),
  // and rewind to pristine when the session clears this question's response.
  const lastExternal = useRef(activityState);
  useEffect(() => {
    if (activityState === lastExternal.current) return;
    lastExternal.current = activityState;
    const next =
      activityState !== undefined &&
      activityState !== null &&
      matchesShape(activityState, initialRef.current)
        ? activityState
        : initialRef.current;
    stateRef.current = next;
    setState(next);
  }, [activityState]);

  const answer = useMemo(() => resolveRef.current(state), [state]);

  const update = useCallback(
    (next: S | ((prev: S) => S)) => {
      if (readOnly) return;
      // Resolve the next value and notify the parent (onChange -> the exam page's
      // setAnswers) here, in the plain function body — not inside the setState updater.
      // React invokes updater functions during its render/work phase, so calling a
      // different component's setState from in there triggers "Cannot update a
      // component while rendering a different component". Computing the value from
      // `stateRef` up front keeps this a single, ordinary state update.
      const value = typeof next === "function" ? (next as (p: S) => S)(stateRef.current) : next;
      stateRef.current = value;
      const resolved = resolveRef.current(value);
      setState(value);
      onChangeRef.current(resolved, value);
    },
    [readOnly]
  );

  const patch = useCallback(
    (partial: Partial<S>) => update((prev) => ({ ...(prev as object), ...(partial as object) } as S)),
    [update]
  );

  const reset = useCallback(() => {
    if (readOnly) return;
    stateRef.current = initialRef.current;
    setState(initialRef.current);
    onChangeRef.current(undefined, undefined);
  }, [readOnly]);

  const restoreState = useCallback((next: S) => {
    stateRef.current = next;
    setState(next);
  }, []);

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

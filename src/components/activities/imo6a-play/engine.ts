"use client";

import { useCallback, useMemo } from "react";
import { Question } from "@/types/question";
import { useActivityEngine } from "../kit/useActivityEngine";

/**
 * The play contract every IMO Set A mini-game follows:
 *
 *   QUESTION → INTERACTIVE WORLD → STUDENT MANIPULATION → LIVE STATE
 *            → ANSWER DERIVED FROM STATE → SUBMIT → OPTION RECORDED
 *
 * `world` is everything the student has built, moved, folded or poured. `derive` is a
 * pure function from that world to the value it produces and the printed option carrying
 * that value. Nothing reaches the scoring engine until the student presses the game's
 * submit control, and any later manipulation withdraws the submission until they submit
 * again, so what is recorded is always what the world currently shows.
 *
 * No game knows which option is correct. Correctness lives only in `correctOptionId`.
 */

export interface Derived {
  /** Student-readable value the world currently produces, e.g. "801" or "R and S". */
  value?: string;
  /** Printed option carrying that value, if any. */
  optionId?: string;
  /** Why no value exists yet, or a remark about the value. */
  note?: string;
}

export interface PlayState<W> {
  v: "play1";
  world: W;
  locked: boolean;
  touched: boolean;
}

const isPlayState = (s: unknown): s is PlayState<unknown> =>
  !!s && typeof s === "object" && (s as PlayState<unknown>).v === "play1" && "world" in (s as object);

interface PlayConfig<W> {
  question?: Question;
  initial: W | (() => W);
  derive: (world: W) => Derived;
  activityState?: unknown;
  value?: unknown;
  onChange: (answer: unknown, state?: unknown) => void;
  readOnly?: boolean;
}

function safeDerive<W>(derive: (w: W) => Derived, world: W): Derived {
  try {
    return derive(world) ?? {};
  } catch (err) {
    console.warn("[play] derive failed", err);
    return {};
  }
}

export function usePlay<W>({ initial, derive, activityState, value, onChange, readOnly }: PlayConfig<W>) {
  // States saved by an earlier generation of this paper's activities have another shape;
  // they are ignored rather than fed into a world that cannot read them.
  const restored = isPlayState(activityState) ? (activityState as PlayState<W>) : undefined;

  const engine = useActivityEngine<PlayState<W>, string>({
    initialState: () => ({
      v: "play1",
      world: typeof initial === "function" ? (initial as () => W)() : initial,
      locked: false,
      touched: false,
    }),
    resolve: (s) => (s.locked ? safeDerive(derive, s.world).optionId : undefined),
    activityState: restored,
    value,
    onChange: onChange as (a: string | undefined, s?: PlayState<W>) => void,
    readOnly,
  });

  const { world, locked, touched } = engine.state;
  const derived = useMemo(() => safeDerive(derive, world), [derive, world]);

  const set = useCallback(
    (next: W | ((prev: W) => W)) =>
      engine.update((p) => ({
        ...p,
        world: typeof next === "function" ? (next as (w: W) => W)(p.world) : next,
        locked: false,
        touched: true,
      })),
    [engine]
  );

  const patch = useCallback(
    (partial: Partial<W>) => set((w) => ({ ...(w as object), ...(partial as object) } as W)),
    [set]
  );

  const submit = useCallback(() => engine.update((p) => ({ ...p, locked: true, touched: true })), [engine]);

  return {
    world,
    derived,
    locked,
    touched,
    set,
    patch,
    submit,
    reset: engine.reset,
    readOnly: engine.readOnly,
  };
}

export type Play<W> = ReturnType<typeof usePlay<W>>;

/** Reads a typed block of `customConfig`, falling back when a field is absent. */
export function cfg<T>(question: Question | undefined, key: string, fallback: T): T {
  const v = question?.customConfig?.[key];
  return (v === undefined || v === null ? fallback : v) as T;
}

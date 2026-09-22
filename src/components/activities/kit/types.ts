import type React from "react";
import { Question } from "@/types/question";

/**
 * Universal contract every Olympiad activity satisfies.
 * The activity IS the answer control: the student manipulates the microworld,
 * the microworld resolves an answer, and that answer is submitted as-is.
 */
export interface InteractiveActivity<S = unknown, A = unknown> {
  /** Answer resolved purely from the current interaction state (undefined = not answerable yet) */
  getAnswer(): A | undefined;
  /** Full serializable interaction state (for pause / resume / revisit) */
  getState(): S;
  /** Rehydrate the microworld from a previously serialized state */
  restoreState(state: S): void;
  /** Return to the pristine, unanswered configuration */
  reset(): void;
  /** Whether the current interaction resolves to a submittable answer */
  isValid(): boolean;
}

/** Props every bespoke activity component receives from the QuestionRenderer. */
export interface ActivityComponentProps<S = any> {
  questionId: string;
  question?: Question;
  /** Previously submitted answer for this question */
  value?: any;
  /** Previously serialized microworld state for this question */
  activityState?: S;
  /** Emits (resolvedAnswer, microworldState). The answer goes straight to the scoring engine. */
  onChange: (answer: any, activityState?: S) => void;
  readOnly?: boolean;
}

export type ActivityComponentType = React.ComponentType<ActivityComponentProps>;

/** Locate the MCQ option whose text matches a resolved activity answer. */
export function optionIdByText(
  question: Question | undefined,
  predicate: (text: string, id: string) => boolean
): string | undefined {
  const opts = question?.multipleChoiceConfig?.options;
  if (!opts) return undefined;
  return opts.find((o) => predicate(o.text, o.id))?.id;
}

/** Human-readable label of an option id, for the answer read-out bar. */
export function optionLabel(question: Question | undefined, id: unknown): string | undefined {
  const opts = question?.multipleChoiceConfig?.options;
  if (!opts || typeof id !== "string") return undefined;
  const opt = opts.find((o) => o.id === id);
  return opt ? `Option ${opt.id} — ${opt.text}` : undefined;
}

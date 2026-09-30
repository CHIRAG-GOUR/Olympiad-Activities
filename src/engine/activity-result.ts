import { Question } from "@/types/question";

/**
 * What an activity produced, stored with the attempt so teachers and admins see the
 * student's actual build, not only the option letter it mapped to.
 */
export interface ActivityResult {
  questionId: string;
  completed: boolean;
  /** The engine / machine that produced the answer, e.g. "WordAssemblyEngine". */
  resultType?: string;
  /** What the student built, e.g. "be unsure" or "“the tiniest mouses'” → “the tiniest mice”". */
  derivedAnswer?: string;
  /** The printed option the build mapped to. */
  selectedOption?: string;
  correct: boolean;
  /** The world the student left behind (blocks placed, lines marked, tasks done). */
  activityState?: unknown;
  /** Answer-key audit note carried by the question, if any. */
  answerAudit?: unknown;
}

type PlayLike = { v?: string; world?: unknown; result?: { value?: string; mappedOption?: string; completed?: boolean } };

export function buildActivityResult(q: Question, state: unknown, answer: unknown, correct: boolean): ActivityResult | undefined {
  const s = state as PlayLike | undefined;
  if (!s || typeof s !== "object") return undefined;
  const r = s.result;
  return {
    questionId: q.id,
    completed: !!r?.completed,
    resultType: (q.customConfig?.engine as string | undefined) ?? undefined,
    derivedAnswer: r?.value,
    selectedOption: r?.mappedOption ?? (typeof answer === "string" ? answer : undefined),
    correct,
    activityState: s.world ?? s,
    answerAudit: q.customConfig?.answerAudit,
  };
}

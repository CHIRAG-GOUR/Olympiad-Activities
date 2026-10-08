import { test } from "node:test";
import assert from "node:assert/strict";
import type { Question } from "@/types/question";
import { orderForSitting, restorePaperOrder, shuffleOptions, canShuffleOptions } from "@/lib/exam/shuffle";

const q = (n: number, section: Question["section"], options?: string[]): Question =>
  ({
    id: `q${n}`,
    questionId: `Q-${n}`,
    section,
    questionType: options ? "MULTIPLE_CHOICE" : "NUMERIC",
    multipleChoiceConfig: options
      ? { options: options.map((text, i) => ({ id: "ABCD"[i], text })), correctOptionId: "A" }
      : undefined,
  }) as unknown as Question;

const paper: Question[] = [
  ...Array.from({ length: 15 }, (_, i) => q(i + 1, "Logical Reasoning", ["10", "20", "30", "40"])),
  ...Array.from({ length: 20 }, (_, i) => q(i + 16, "Mathematical Reasoning")),
];

test("the same sitting always sees the same order (refresh, crash, other device)", () => {
  const a = orderForSitting(paper, "sess_exam_uidA_att1").map((x) => x.id);
  const b = orderForSitting(paper, "sess_exam_uidA_att1").map((x) => x.id);
  assert.deepEqual(a, b);
});

test("two students sitting side by side see different orders", () => {
  const a = orderForSitting(paper, "sess_exam_uidA_att1").map((x) => x.id);
  const b = orderForSitting(paper, "sess_exam_uidB_att1").map((x) => x.id);
  assert.notDeepEqual(a, b);
});

test("questions stay inside their section; sections keep their printed order", () => {
  const order = orderForSitting(paper, "seed-1");
  assert.ok(order.slice(0, 15).every((x) => x.section === "Logical Reasoning"));
  assert.ok(order.slice(15).every((x) => x.section === "Mathematical Reasoning"));
  assert.deepEqual(new Set(order.map((x) => x.id)), new Set(paper.map((x) => x.id)));
});

test("scoring order is restored exactly", () => {
  const shuffled = orderForSitting(paper, "seed-2");
  assert.deepEqual(
    restorePaperOrder(shuffled, paper.map((x) => x.id)).map((x) => x.id),
    paper.map((x) => x.id)
  );
});

test("options move but every letter stays with its own answer", () => {
  const original = q(1, "Logical Reasoning", ["ten", "twenty", "thirty", "forty"]);
  const shuffled = shuffleOptions(original, "seed-3");
  const pairs = (x: Question) => new Map(x.multipleChoiceConfig!.options.map((o) => [o.id, o.text]));
  assert.deepEqual(pairs(shuffled), pairs(original));
  assert.equal(shuffled.multipleChoiceConfig!.correctOptionId, "A");
});

test('"All of the above" style options are never moved', () => {
  const fixed = q(2, "Logical Reasoning", ["Red", "Blue", "Green", "All of the above"]);
  assert.equal(canShuffleOptions(fixed), false);
  assert.equal(shuffleOptions(fixed, "x"), fixed);
});

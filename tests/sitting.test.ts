import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveSitting, sittingNumberFromSessionId } from "@/lib/exam/sitting";

type S = { status: string; attemptId?: string };

/** A fake session store: sitting number → session. */
const store = (sessions: Record<number, S>) => async (n: number) => sessions[n] ?? null;

test("first visit: nothing filed, nothing saved → sitting 1", async () => {
  const r = await resolveSitting<S>([], store({}));
  assert.deepEqual([r.used, r.attemptNumber, r.current], [0, 1, null]);
});

test("progress saved on sitting 1 is resumed, not restarted", async () => {
  const r = await resolveSitting<S>([], store({ 1: { status: "in_progress" } }));
  assert.equal(r.used, 0);
  assert.equal(r.current?.status, "in_progress");
});

test("after one filed attempt, a retake is sitting 2 with its own session", async () => {
  const r = await resolveSitting<S>(["att_1"], store({ 1: { status: "submitted", attemptId: "att_1" } }));
  assert.deepEqual([r.used, r.attemptNumber, r.current, r.lastAttemptId], [1, 2, null, "att_1"]);
});

test("a retake in progress is found again after a reload (the old bug sent students back to the old result)", async () => {
  const r = await resolveSitting<S>(["att_1"], store({ 1: { status: "submitted" }, 2: { status: "in_progress" } }));
  assert.equal(r.attemptNumber, 2);
  assert.equal(r.current?.status, "in_progress");
});

test("a sitting submitted offline (not yet uploaded) still uses up its number", async () => {
  const r = await resolveSitting<S>([], store({ 1: { status: "submitted", attemptId: "att_offline" } }));
  assert.deepEqual([r.used, r.attemptNumber, r.lastAttemptId], [1, 2, "att_offline"]);
});

test("a mid-submit sitting is returned so the upload can finish", async () => {
  const r = await resolveSitting<S>(["a1"], store({ 2: { status: "submitting", attemptId: "a2" } }));
  assert.equal(r.current?.status, "submitting");
  assert.equal(r.attemptNumber, 2);
});

test("sitting numbers are read from session ids", () => {
  assert.equal(sittingNumberFromSessionId("sess_exam1_uid9_att3"), 3);
  assert.equal(sittingNumberFromSessionId("sess_legacy_random"), 1);
  assert.equal(sittingNumberFromSessionId(undefined), 1);
});

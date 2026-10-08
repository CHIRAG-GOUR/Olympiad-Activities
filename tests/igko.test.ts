import { test } from "node:test";
import assert from "node:assert/strict";
import { IGKO_G6_SCITECH_EXAM, IGKO_G6_SCITECH_KEY, IGKO_G6_SCITECH_QUESTIONS } from "@/data/igko_g6_scitech";
import { SEED_EXAMS, SEED_QUESTIONS } from "@/lib/seedData";
import { IGKO_G6_SCITECH_ACTIVITY_MAP } from "@/components/activities/igko_g6_scitech-play/registry";
import {
  resolveOption,
  evaluateNobel,
  evaluatePlasma,
  evaluateLunar,
  evaluateForce,
  evaluateImaging,
  plasmaInitial,
  setEnergy,
  type Evaluation,
} from "@/components/activities/igko_g6_scitech-play/logic";
import { seededShuffle } from "@/lib/exam/shuffle";

const question = (n: number) => IGKO_G6_SCITECH_QUESTIONS.find((q) => q.customConfig?.questionNumber === n)!;
const options = (n: number) => question(n).multipleChoiceConfig!.options;
const pick = (n: number, ev: Evaluation) => resolveOption(options(n), ev);

test("verified key from the source paper", () => {
  assert.equal(IGKO_G6_SCITECH_KEY, "BACBDCBDDCBABCC");
  for (const q of IGKO_G6_SCITECH_QUESTIONS) {
    assert.equal(q.multipleChoiceConfig!.correctOptionId, IGKO_G6_SCITECH_KEY[(q.customConfig!.questionNumber as number) - 1]);
  }
});

test("the paper is a real exam in the normal exam system", () => {
  assert.ok(SEED_EXAMS.some((e) => e.id === IGKO_G6_SCITECH_EXAM.id));
  for (const id of IGKO_G6_SCITECH_EXAM.questionIds) assert.ok(SEED_QUESTIONS.some((q) => q.id === id), `${id} missing from the question bank`);
  assert.equal(IGKO_G6_SCITECH_EXAM.grade, 6);
  assert.equal(IGKO_G6_SCITECH_EXAM.totalQuestions, IGKO_G6_SCITECH_EXAM.questionIds.length);
});

test("every question in the paper has its activity and never offers option buttons", () => {
  for (const q of IGKO_G6_SCITECH_QUESTIONS) {
    assert.ok(IGKO_G6_SCITECH_ACTIVITY_MAP[q.id], `${q.id} has no activity`);
    assert.ok(IGKO_G6_SCITECH_ACTIVITY_MAP[q.questionId], `${q.questionId} has no activity`);
    assert.equal(q.customConfig?.activityOnly, true);
  }
});

test("Q1: carrying the Peace award to Oslo gives B; other deliveries give their own options", () => {
  assert.equal(pick(1, evaluateNobel({ inspected: [], delivery: { prize: "Peace", city: "oslo" } })), "B");
  assert.equal(pick(1, evaluateNobel({ inspected: [], delivery: { prize: "Peace", city: "stockholm" } })), "D");
  assert.equal(pick(1, evaluateNobel({ inspected: [], delivery: { prize: "Chemistry", city: "stockholm" } })), "A");
  assert.equal(pick(1, evaluateNobel({ inspected: [], delivery: { prize: "Literature", city: "oslo" } })), undefined);
  assert.equal(pick(1, evaluateNobel({ inspected: [], delivery: null })), undefined);
  assert.deepEqual(evaluateNobel({ inspected: [], delivery: { prize: "Peace", city: "oslo" } }).result, { prize: "Peace", country: "Norway", city: "Oslo" });
});

test("Q2: the analyser must measure the chamber; plasma gives A, gas gives C", () => {
  let w = setEnergy(plasmaInitial(), 95);
  assert.equal(pick(2, evaluatePlasma(w)), undefined, "not analysed yet");
  w = { ...w, analysedAt: w.energy };
  assert.equal(pick(2, evaluatePlasma(w)), "A");
  assert.equal(evaluatePlasma(w).result?.state, "plasma");
  assert.equal(pick(2, evaluatePlasma({ ...w, energy: 60, analysedAt: 60 })), "C");
  assert.equal(pick(2, evaluatePlasma({ ...w, energy: 30, analysedAt: 30 })), undefined);
  assert.equal(setEnergy(w, 50).analysedAt, null, "changing the energy invalidates the measurement");
  assert.deepEqual(setEnergy(setEnergy(setEnergy(plasmaInitial(), 30), 60), 90).reached, ["Solid", "Liquid", "Gas", "Plasma"]);
});

test("Q3: orbiter + impactor to the Moon is Chandrayaan-1 (C); other real configurations map to their missions", () => {
  assert.equal(pick(3, evaluateLunar({ stack: ["orbiter", "impactor"], destination: "moon", launched: true })), "C");
  assert.equal(evaluateLunar({ stack: ["impactor", "orbiter"], destination: "moon", launched: true }).result?.waterDetected, true);
  assert.equal(pick(3, evaluateLunar({ stack: ["orbiter", "lander", "rover"], destination: "moon", launched: true })), "A");
  assert.equal(pick(3, evaluateLunar({ stack: ["propulsion", "lander", "rover"], destination: "moon", launched: true })), "B");
  assert.equal(pick(3, evaluateLunar({ stack: ["orbiter"], destination: "mars", launched: true })), "D");
  assert.equal(pick(3, evaluateLunar({ stack: ["orbiter", "impactor"], destination: "mars", launched: true })), undefined);
  assert.equal(pick(3, evaluateLunar({ stack: ["orbiter", "impactor"], destination: "moon", launched: false })), undefined);
});

test("Q4: a sinking object records gravity (B); floating gives A; the spring gives C", () => {
  assert.equal(pick(4, evaluateForce({ massKg: 2, volumeL: 1, onSpring: false, released: true })), "B");
  assert.equal(evaluateForce({ massKg: 2, volumeL: 1, onSpring: false, released: true }).result?.sinkingForce, "gravitational");
  assert.equal(pick(4, evaluateForce({ massKg: 0.5, volumeL: 1, onSpring: false, released: true })), "A");
  assert.equal(pick(4, evaluateForce({ massKg: 2, volumeL: 1, onSpring: true, released: true })), "C");
  assert.equal(pick(4, evaluateForce({ massKg: 1, volumeL: 1, onSpring: false, released: true })), undefined);
  assert.equal(pick(4, evaluateForce({ massKg: 2, volumeL: 1, onSpring: false, released: false })), undefined);
});

test("Q5: only an operated station can be identified; the MRI gives D", () => {
  assert.equal(pick(5, evaluateImaging({ station: "mri", operated: [], identified: "mri" })), undefined);
  assert.equal(pick(5, evaluateImaging({ station: "mri", operated: ["mri"], identified: "mri" })), "D");
  assert.equal(evaluateImaging({ station: "mri", operated: ["mri"], identified: "mri" }).result?.ionisingRadiation, false);
  assert.equal(pick(5, evaluateImaging({ station: "xray", operated: ["xray"], identified: "xray" })), "A");
  assert.equal(pick(5, evaluateImaging({ station: "ultrasound", operated: ["ultrasound"], identified: "ultrasound" })), "C");
  assert.equal(pick(5, evaluateImaging({ station: "chemo", operated: ["chemo"], identified: "chemo" })), "B");
});

test("shuffling the printed options never changes which letter a result maps to", () => {
  const ev = evaluateNobel({ inspected: [], delivery: { prize: "Peace", city: "oslo" } });
  for (const seed of ["s1", "s2", "s3", "s4"]) {
    assert.equal(resolveOption(seededShuffle(options(1), seed), ev), "B");
  }
});

test("Q2: heating straight from liquid to plasma still records gas on the way", () => {
  const w = setEnergy(setEnergy(plasmaInitial(), 40), 95);
  assert.deepEqual(w.reached, ["Solid", "Liquid", "Gas", "Plasma"]);
});

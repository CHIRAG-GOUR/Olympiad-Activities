import { test } from "node:test";
import assert from "node:assert/strict";
import { IGKO_G6_SCITECH_KEY, IGKO_G6_SCITECH_QUESTIONS } from "@/data/igko_g6_scitech";
import * as L from "@/components/activities/igko_g6_scitech-play/logic";

/**
 * Every IGKO question is answered by one action in its world. These tests check, for all 15:
 *   • each printed option (A–D) can be given that way — wrong answers included;
 *   • the action matching the verified key gives the key;
 *   • experiments alone never produce an answer, and evaluation never states a verdict.
 */

const options = (n: number) => IGKO_G6_SCITECH_QUESTIONS.find((q) => q.customConfig?.questionNumber === n)!.multipleChoiceConfig!.options;
const pick = (n: number, ev: L.Evaluation) => L.resolveOption(options(n), ev);

/** For each question: its untouched world (after some investigation), and one answered world per letter. */
const CASES: Record<number, { investigated: L.Evaluation; answers: Record<"A" | "B" | "C" | "D", L.Evaluation> }> = {
  1: {
    investigated: L.evaluateNobel(L.nobelInitial()),
    answers: {
      A: L.evaluateNobel({ delivery: { prize: "Chemistry", city: "stockholm" } }),
      B: L.evaluateNobel({ delivery: { prize: "Peace", city: "oslo" } }),
      C: L.evaluateNobel({ delivery: { prize: "Physics", city: "oslo" } }),
      D: L.evaluateNobel({ delivery: { prize: "Peace", city: "stockholm" } }),
    },
  },
  2: (() => {
    const w = L.setEnergy(L.plasmaInitial(), 95);
    const at = (j: L.JarId) => L.evaluatePlasma({ ...w, jars: [j], display: [null, null, null, j] });
    return { investigated: L.evaluatePlasma({ ...w, jars: ["plasma", "gas"] }), answers: { A: at("plasma"), B: at("steam"), C: at("gas"), D: at("matteroid") } };
  })(),
  3: (() => {
    const flown: L.LunarWorld = { stack: ["orbiter", "impactor"], destination: "moon", launched: true, patch: null };
    const p = (patch: L.PatchId) => L.evaluateLunar({ ...flown, patch });
    return { investigated: L.evaluateLunar(flown), answers: { A: p("c2"), B: p("c3"), C: p("c1"), D: p("mom") } };
  })(),
  4: (() => {
    const w = { ...L.forceInitial(), released: true };
    const c = (cause: L.ForceId) => L.evaluateForce({ ...w, cause });
    return { investigated: L.evaluateForce(w), answers: { A: c("buoyant"), B: c("gravitational"), C: c("spring"), D: c("air") } };
  })(),
  5: (() => {
    const w: L.ImagingWorld = { station: "mri", operated: ["mri", "xray"], referral: null };
    const r = (t: L.Tech) => L.evaluateImaging({ ...w, referral: t });
    return { investigated: L.evaluateImaging(w), answers: { A: r("xray"), B: r("chemo"), C: r("ultrasound"), D: r("mri") } };
  })(),
  6: (() => {
    const w = { ...L.ramanInitial(), laserOn: true, mirrorDeg: 45, sample: "benzene" as const, detectorDeg: 90 };
    const recorded = { ...w, recorded: L.spectrum(w) };
    const n = (s: L.ScientistId) => L.evaluateRaman({ ...recorded, namedAfter: s });
    return { investigated: L.evaluateRaman(recorded), answers: { A: n("chandrasekhar"), B: n("ramakrishnan"), C: n("raman"), D: n("khorana") } };
  })(),
  7: (() => {
    const w = { ...L.milkInitial(), hours: 12, pHMeasured: true, reverseTried: true };
    const t = (tray: L.TrayId) => L.evaluateMilk({ ...w, tray });
    return { investigated: L.evaluateMilk(w), answers: { A: t("physical"), B: t("chemical"), C: t("both"), D: t("none") } };
  })(),
  8: (() => {
    const w = { vinegarMl: 50, sodaG: 5, mixed: true, filedAs: null };
    const f = (s: L.ReactionSlot) => L.evaluateReactor({ ...w, filedAs: s });
    return { investigated: L.evaluateReactor(w), answers: { A: f("combustion"), B: f("anaerobic"), C: f("aerobic"), D: f("metathesis") } };
  })(),
  9: (() => {
    const w: L.BotanyWorld = { dissected: ["tomato", "blueberry"], filed: null };
    const f = (s: L.Species) => L.evaluateBotany({ ...w, filed: s });
    return { investigated: L.evaluateBotany(w), answers: { A: f("cranberry"), B: f("elderberry"), C: f("blueberry"), D: f("tomato") } };
  })(),
  10: (() => {
    const w: L.EnergyWorld = { connected: ["coal", "solar"], hour: 12, nominated: null };
    const f = (s: L.EnergySource) => L.evaluateEnergy({ ...w, nominated: s });
    return { investigated: L.evaluateEnergy(w), answers: { A: f("coal"), B: f("gas"), C: f("solar"), D: f("petroleum") } };
  })(),
  11: (() => {
    const w: L.ObservatoryWorld = { sunlightOn: false, readings: { "moon:on": 12, "moon:off": 0 }, tagged: null };
    const t = (o: L.SkyObject) => L.evaluateObservatory({ ...w, tagged: o });
    return { investigated: L.evaluateObservatory(w), answers: { A: t("sun"), B: t("moon"), C: t("star"), D: t("firefly") } };
  })(),
  12: (() => {
    const w: L.MuseumWorld = { timeline: ["m1945", "m1948", "m1966"], plaque: null };
    const p = (e: L.ExhibitId) => L.evaluateMuseum({ ...w, plaque: e });
    return { investigated: L.evaluateMuseum(w), answers: { A: p("bhabha"), B: p("bose"), C: p("kalam"), D: p("sarabhai") } };
  })(),
  13: (() => {
    const w: L.ThermalWorld = { station: "plate", touching: true, seconds: 30, runs: { plate: 160 }, tag: null };
    const t = (tag: L.HeatTag) => L.evaluateThermal({ ...w, tag });
    return { investigated: L.evaluateThermal(w), answers: { A: t("convection"), B: t("conduction"), C: t("insulation"), D: t("radiation") } };
  })(),
  14: (() => {
    const w: L.DiveWorld = { depth: 200, log: [0, 100, 200].map((d) => ({ depth: d, kPa: L.pressureAt(d) })), trend: null };
    const t = (trend: L.TrendId) => L.evaluateDive({ ...w, trend });
    return { investigated: L.evaluateDive(w), answers: { A: t("zigzag"), B: t("falls"), C: t("rises"), D: t("flat") } };
  })(),
  15: (() => {
    const w: L.MotorWorld = { installed: ["battery", "wires", "coil", "magnets", "rotor"], switchOn: true, plate: null };
    const c = (card: L.FunctionCard) => L.evaluateMotor({ ...w, plate: card });
    return { investigated: L.evaluateMotor(w), answers: { A: c("light"), B: c("stores"), C: c("changes"), D: c("temperature") } };
  })(),
};

for (let n = 1; n <= 15; n++) {
  test(`Q${n}: every printed option can be given in the world, and the key's action gives ${IGKO_G6_SCITECH_KEY[n - 1]}`, () => {
    const c = CASES[n];
    for (const letter of ["A", "B", "C", "D"] as const) {
      assert.equal(pick(n, c.answers[letter]), letter, `Q${n}: the action for ${letter} gave ${pick(n, c.answers[letter])}`);
    }
    assert.equal(pick(n, c.answers[IGKO_G6_SCITECH_KEY[n - 1] as "A" | "B" | "C" | "D"]), IGKO_G6_SCITECH_KEY[n - 1]);
  });

  test(`Q${n}: experimenting alone never answers, and nothing reports right or wrong`, () => {
    const c = CASES[n];
    assert.equal(c.investigated.completed, false);
    assert.equal(pick(n, c.investigated), undefined);
    for (const ev of [c.investigated, ...Object.values(c.answers)]) {
      const text = `${ev.derivedAnswer ?? ""} ${ev.note ?? ""} ${JSON.stringify(ev.result ?? {})}`.toLowerCase();
      assert.doesNotMatch(text, /\bcorrect\b|\bincorrect\b|\bwrong\b|\bright answer\b/, `Q${n} evaluation hints at a verdict: ${text}`);
    }
  });
}

test("Q1: pairings the paper does not offer cannot be recorded", () => {
  assert.equal(pick(1, L.evaluateNobel({ delivery: { prize: "Physics", city: "stockholm" } })), undefined);
  assert.equal(pick(1, L.evaluateNobel({ delivery: { prize: "Chemistry", city: "oslo" } })), undefined);
});

test("Q2: heating straight from liquid to plasma still records gas on the way", () => {
  assert.deepEqual(L.setEnergy(L.setEnergy(L.plasmaInitial(), 40), 95).reached, ["Solid", "Liquid", "Gas", "Plasma"]);
});

test("Q2: a solid or liquid jar in the 4th slot is not one of the paper's answers", () => {
  const w = { ...L.plasmaInitial(), display: [null, null, null, "liquid"] as (L.JarId | null)[] };
  assert.equal(pick(2, L.evaluatePlasma(w)), undefined);
  assert.equal(L.evaluatePlasma(w).note, L.NOT_A_CHOICE);
});

test("Q3/Q6/Q9: investigation output never names the answer", () => {
  // Telemetry reports instruments only; the Raman spectrum is numbers; specimen data is structure only.
  assert.deepEqual(Object.keys(L.lunarTelemetry({ stack: ["orbiter", "impactor"], destination: "moon", launched: true, patch: null })).sort(), ["flown", "impactor", "orbiter", "waterDetected"]);
  assert.ok(!JSON.stringify(L.SPECIES_INFO).toLowerCase().includes("vegetable"));
  assert.ok(!JSON.stringify(L.spectrum({ ...L.ramanInitial(), laserOn: true, mirrorDeg: 45, sample: "water", detectorDeg: 90 })).toLowerCase().includes("raman"));
});

test("Q4: forces behave physically on the switchboard", () => {
  const base = { ...L.forceInitial(), released: true };
  const only = (f: L.ForceId) => ({ gravitational: false, buoyant: false, spring: false, air: false, [f]: true });
  assert.equal(L.forceOutcome({ ...base, enabled: only("gravitational") }), "sinks");
  assert.equal(L.forceOutcome({ ...base, enabled: only("buoyant") }), "rises");
  assert.equal(L.forceOutcome({ ...base, enabled: { ...only("gravitational"), spring: true } }), "hangs");
  assert.equal(L.forceOutcome({ ...base, enabled: only("air") }), "drifts");
});

test("Q13: touching the plate heats the probe fast; the glove keeps it cool", () => {
  assert.ok(L.probeTemp({ station: "plate", touching: true, seconds: 30 }) > 100);
  assert.ok(L.probeTemp({ station: "glove", touching: true, seconds: 30 }) < 45);
});

test("Q15: without magnets the motor does not turn", () => {
  assert.equal(L.motorState({ installed: ["battery", "wires", "coil", "rotor"], switchOn: true }).spinning, false);
  assert.equal(L.motorState({ installed: ["battery", "wires", "coil", "magnets", "rotor"], switchOn: true }).spinning, true);
});

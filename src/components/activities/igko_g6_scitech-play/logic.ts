/**
 * IGKO Class 6 — Science & Technology: the rules of each investigation.
 *
 * Every activity has two parts:
 *
 *   1. Investigation — experiments and evidence. Optional: nothing here is required to
 *      answer, and nothing here ever states which answer is right.
 *   2. Answering — one deliberate action inside the world (deliver a crate, attach a mission
 *      patch, place a sample in a display case…). Every printed option can be given this
 *      way, right or wrong, and the action is what is recorded.
 *
 * Pure functions only (no React, no 3D), so every path can be tested:
 *
 *   world → evaluate(world) → the student's answer → resolveOption → printed option
 *
 * `resolveOption` finds the printed option by its text, so shuffled options cannot change
 * the mapping and no activity knows which letter is correct.
 */

export interface SourceOption {
  id: string;
  text: string;
}

export interface Evaluation {
  /** The student has given an answer through the activity. */
  completed: boolean;
  /** The student's answer in their own terms, e.g. "Peace award delivered to Oslo, Norway". */
  derivedAnswer?: string;
  /** What was answered and the evidence gathered, for the report. Never a verdict. */
  result?: Record<string, unknown>;
  /** Printed option text(s) the answer corresponds to; several spellings allowed. */
  optionText?: string | string[];
  /** Guidance when nothing has been answered yet, or the answer is not one of the choices. */
  note?: string;
}

const norm = (s: string) => s.toLowerCase().replace(/[\s\-–—]+/g, " ").replace(/[^a-z0-9 ,]/g, "").trim();

/** The one printed option whose text matches the answer, if any. */
export function resolveOption(options: SourceOption[] | undefined, evaluation: Evaluation): string | undefined {
  if (!evaluation.completed || !evaluation.optionText || !options) return undefined;
  const wanted = new Set((Array.isArray(evaluation.optionText) ? evaluation.optionText : [evaluation.optionText]).map(norm));
  const hits = options.filter((o) => wanted.has(norm(o.text)));
  return hits.length === 1 ? hits[0].id : undefined;
}

/** A neutral note for an answer the paper does not offer — it says nothing about right or wrong. */
export const NOT_A_CHOICE = "Your paper does not offer that as an answer. Think again and give a different one.";

const unanswered = (note: string): Evaluation => ({ completed: false, note });

/* ── Q1 · Nobel Mission Control ─────────────────────────────── */

/** Award crates on the dock. */
export const PRIZES = ["Physics", "Chemistry", "Peace"] as const;
export type Prize = (typeof PRIZES)[number];

export const CITIES = {
  stockholm: { name: "Stockholm", country: "Sweden", hall: "Stockholm Concert Hall" },
  oslo: { name: "Oslo", country: "Norway", hall: "Oslo City Hall" },
} as const;
export type City = keyof typeof CITIES;

/** What the foundation terminal shows: background only, nothing that answers the question. */
export const NOBEL_BACKGROUND = [
  "Alfred Nobel (1833–1896) was a Swedish chemist, engineer and inventor.",
  "His will of 1895 set up five prizes: Physics, Chemistry, Physiology or Medicine, Literature and Peace.",
  "The first prizes were awarded in 1901. Each prize has its own ceremony and committee.",
];

export interface NobelWorld {
  /** The answer: which award crate was delivered to which ceremonial hall. */
  delivery: { prize: Prize; city: City } | null;
}

export const nobelInitial = (): NobelWorld => ({ delivery: null });

export function evaluateNobel(w: NobelWorld): Evaluation {
  if (!w.delivery) return unanswered("Carry one award crate to the hall where you think that prize is presented.");
  const { prize, city } = w.delivery;
  const c = CITIES[city];
  return {
    completed: true,
    derivedAnswer: `${prize} award delivered to ${c.hall}, ${c.country}`,
    result: { prize, country: c.country, city: c.name },
    optionText: `${prize}, ${c.country}`,
  };
}

/* ── Q2 · Plasma Reactor ─────────────────────────────────────── */

export const MATTER_STATES = ["Solid", "Liquid", "Gas", "Plasma"] as const;
export type MatterState = (typeof MATTER_STATES)[number];

/** The state of the chamber's contents at an energy level (0–100). */
export function stateAtEnergy(energy: number): MatterState {
  if (energy < 22) return "Solid";
  if (energy < 48) return "Liquid";
  if (energy < 82) return "Gas";
  return "Plasma";
}

/** Share of particles ionised (electrons stripped), 0–1. */
export const ionisationAt = (energy: number) => Math.max(0, Math.min(1, (energy - 74) / 16));

/** Sample jars the student can collect. */
export const JARS = {
  solid: { label: "Solid", from: "Reactor chamber", optionText: null as string | null },
  liquid: { label: "Liquid", from: "Reactor chamber", optionText: null as string | null },
  gas: { label: "Gas", from: "Reactor chamber", optionText: "Gas" },
  plasma: { label: "Plasma", from: "Reactor chamber", optionText: "Plasma" },
  steam: { label: "Steam", from: "Kettle", optionText: "Steam" },
  matteroid: { label: "Matteroid", from: "Curiosities shelf", optionText: "Matteroid" },
} as const;
export type JarId = keyof typeof JARS;

export interface PlasmaWorld {
  energy: number;
  /** States the chamber has passed through, in order. */
  reached: MatterState[];
  /** Jars collected so far. */
  jars: JarId[];
  /** The display case "States of Matter", slots 1st–4th. The 4th slot is the answer. */
  display: (JarId | null)[];
}

export const plasmaInitial = (): PlasmaWorld => ({ energy: 8, reached: ["Solid"], jars: [], display: [null, null, null, null] });

/** Applies an energy change, recording every state passed through on the way. */
export function setEnergy(w: PlasmaWorld, energy: number): PlasmaWorld {
  const e = Math.max(0, Math.min(100, Math.round(energy)));
  const from = MATTER_STATES.indexOf(stateAtEnergy(w.energy));
  const to = MATTER_STATES.indexOf(stateAtEnergy(e));
  const step = to >= from ? 1 : -1;
  const reached = [...w.reached];
  for (let i = from; ; i += step) {
    if (!reached.includes(MATTER_STATES[i])) reached.push(MATTER_STATES[i]);
    if (i === to) break;
  }
  return { ...w, energy: e, reached };
}

/** A jar of whatever the chamber holds right now. */
export const chamberJar = (energy: number): JarId => stateAtEnergy(energy).toLowerCase() as JarId;

export function evaluatePlasma(w: PlasmaWorld): Evaluation {
  const fourth = w.display[3];
  if (!fourth) return unanswered("Collect samples and place the one you think is the fourth state of matter in the 4th slot of the display case.");
  const jar = JARS[fourth];
  if (!jar.optionText) return { completed: true, derivedAnswer: `${jar.label} placed as the 4th state`, result: { fourthState: fourth }, note: NOT_A_CHOICE };
  return {
    completed: true,
    derivedAnswer: `${jar.label} placed as the 4th state of matter`,
    result: { fourthState: fourth, display: w.display, statesObserved: w.reached },
    optionText: jar.optionText,
  };
}

/* ── Q3 · Lunar mission reconstruction ───────────────────────── */

export const MODULES = ["orbiter", "impactor", "lander", "rover", "propulsion"] as const;
export type MissionModule = (typeof MODULES)[number];
export type Destination = "moon" | "mars";

export const MODULE_INFO: Record<MissionModule, { name: string; role: string }> = {
  orbiter: { name: "Orbiter", role: "Circles the body, mapping it with remote-sensing instruments." },
  impactor: { name: "Impact probe", role: "Released from the orbiter; falls and strikes the surface, sampling as it descends." },
  lander: { name: "Lander", role: "Makes a soft landing and carries surface experiments." },
  rover: { name: "Rover", role: "Drives across the surface from the lander." },
  propulsion: { name: "Propulsion module", role: "Carries a lander into orbit; has no science orbiter of its own." },
};

/** Mission patches in the archive; `spellings` are how the printed paper may write them. */
export const PATCHES = {
  c1: { name: "Chandrayaan-1", spellings: ["Chandrayaan-1", "Chandrayan-1"] },
  c2: { name: "Chandrayaan-2", spellings: ["Chandrayaan-2", "Chandrayan-2"] },
  c3: { name: "Chandrayaan-3", spellings: ["Chandrayaan-3", "Chandrayan-3"] },
  mom: { name: "Mangalyaan", spellings: ["Mangalyaan", "Mangalyan"] },
} as const;
export type PatchId = keyof typeof PATCHES;

export interface LunarWorld {
  stack: MissionModule[];
  destination: Destination | null;
  launched: boolean;
  /** The answer: the mission patch attached to the spacecraft. */
  patch: PatchId | null;
}

export const lunarInitial = (): LunarWorld => ({ stack: [], destination: null, launched: false, patch: null });

/** What the probe's instruments detect once flown (evidence, never a mission name). */
export function lunarTelemetry(w: LunarWorld) {
  return {
    flown: w.launched,
    orbiter: w.launched && w.stack.includes("orbiter"),
    impactor: w.launched && w.stack.includes("impactor"),
    waterDetected: w.launched && w.destination === "moon" && w.stack.includes("impactor"),
  };
}

export function evaluateLunar(w: LunarWorld): Evaluation {
  if (!w.patch) return unanswered("Rebuild the mission, then attach the mission patch you think it flew under.");
  const p = PATCHES[w.patch];
  return {
    completed: true,
    derivedAnswer: `${p.name} patch attached to your spacecraft`,
    result: { mission: p.name, modules: w.stack, destination: w.destination, telemetry: lunarTelemetry(w) },
    optionText: [...p.spellings],
  };
}

/* ── Q4 · Underwater force laboratory ────────────────────────── */

export const G = 9.8;
export const WATER_DENSITY = 1; // kg per litre

export const FORCES = {
  gravitational: { name: "Gravitational force", optionText: "Gravitational Force", direction: "down" },
  buoyant: { name: "Buoyant force", optionText: "Buoyant Force", direction: "up" },
  spring: { name: "Spring force", optionText: "Spring Force", direction: "up" },
  air: { name: "Air resistance", optionText: "Air resistant force", direction: "against motion" },
} as const;
export type ForceId = keyof typeof FORCES;

export interface ForceWorld {
  massKg: number;
  volumeL: number;
  /** Which forces the switchboard lets act on the object. */
  enabled: Record<ForceId, boolean>;
  released: boolean;
  /** The answer: the force the student marks as what sinks the object. */
  cause: ForceId | null;
}

export const forceInitial = (): ForceWorld => ({
  massKg: 1.6,
  volumeL: 1,
  enabled: { gravitational: true, buoyant: true, spring: false, air: true },
  released: false,
  cause: null,
});

export function forces(w: Pick<ForceWorld, "massKg" | "volumeL">) {
  return {
    gravity: +(w.massKg * G).toFixed(2),
    maxBuoyancy: +(w.volumeL * WATER_DENSITY * G).toFixed(2),
    density: +(w.massKg / w.volumeL).toFixed(2),
  };
}

export type ForceOutcome = "sinks" | "floats" | "rises" | "hangs" | "drifts" | "waiting";

/** What the object does with the chosen forces acting. */
export function forceOutcome(w: ForceWorld): ForceOutcome {
  if (!w.released) return "waiting";
  const { gravity, maxBuoyancy } = forces(w);
  const down = w.enabled.gravitational ? gravity : 0;
  const up = (w.enabled.buoyant ? maxBuoyancy : 0) + (w.enabled.spring ? down : 0);
  if (w.enabled.spring && down > 0) return "hangs";
  if (down === 0 && up === 0) return "drifts";
  if (down === 0) return "rises";
  return down > up + 0.05 ? "sinks" : "floats";
}

export function evaluateForce(w: ForceWorld): Evaluation {
  if (!w.cause) return unanswered("Experiment with the forces, then mark the force you think makes the object sink.");
  const f = FORCES[w.cause];
  return {
    completed: true,
    derivedAnswer: `${f.name} marked as the force that sinks the object`,
    result: { cause: w.cause, lastOutcome: forceOutcome(w), enabled: w.enabled, massKg: w.massKg, volumeL: w.volumeL },
    optionText: f.optionText,
  };
}

/* ── Q5 · Medical imaging centre ─────────────────────────────── */

export const TECHS = ["xray", "ultrasound", "mri", "chemo"] as const;
export type Tech = (typeof TECHS)[number];

export const STRUCTURES = ["Organs", "Bones", "Muscles", "Blood vessels"] as const;

export interface TechSpec {
  station: string;
  name: string;
  spellings: string[];
  radiationUSv: number;
  fieldT: number;
  invasive: boolean;
  producesImage: boolean;
  shows: (typeof STRUCTURES)[number][];
  howItWorks: string;
}

export const TECH_SPECS: Record<Tech, TechSpec> = {
  xray: {
    station: "Room 1",
    name: "X-ray",
    spellings: ["X-ray"],
    radiationUSv: 20,
    fieldT: 0,
    invasive: false,
    producesImage: true,
    shows: ["Bones"],
    howItWorks: "A beam passes through the body onto a detector plate.",
  },
  ultrasound: {
    station: "Room 2",
    name: "Sonography",
    spellings: ["Sonography"],
    radiationUSv: 0,
    fieldT: 0,
    invasive: false,
    producesImage: true,
    shows: ["Organs", "Blood vessels"],
    howItWorks: "A probe on the skin sends sound pulses and listens for echoes.",
  },
  mri: {
    station: "Room 3",
    name: "MRI",
    spellings: ["MRI"],
    radiationUSv: 0,
    fieldT: 1.5,
    invasive: false,
    producesImage: true,
    shows: ["Organs", "Bones", "Muscles", "Blood vessels"],
    howItWorks: "A large magnet and radio waves build slices through the body.",
  },
  chemo: {
    station: "Room 4",
    name: "Chemotherapy",
    spellings: ["Chemotherapy", "Chemotheraphy"],
    radiationUSv: 0,
    fieldT: 0,
    invasive: true,
    producesImage: false,
    shows: [],
    howItWorks: "Medicine is given into the bloodstream through a drip.",
  },
};

export interface ImagingWorld {
  station: Tech | null;
  /** Rooms run on the patient (evidence). */
  operated: Tech[];
  /** The answer: the room whose procedure the student signs off on the referral form. */
  referral: Tech | null;
}

export const imagingInitial = (): ImagingWorld => ({ station: null, operated: [], referral: null });

export function evaluateImaging(w: ImagingWorld): Evaluation {
  if (!w.referral) return unanswered("Investigate the rooms, then sign the referral for the test the question describes.");
  const s = TECH_SPECS[w.referral];
  return {
    completed: true,
    derivedAnswer: `Referral signed for ${s.name} (${s.station})`,
    result: { imagingMethod: s.name, roomsOperated: w.operated },
    optionText: s.spellings,
  };
}

/* ── Q6 · Raman light laboratory ─────────────────────────────── */

export const SAMPLES = {
  none: { name: "Empty cell", transparent: true, shiftCm: 0 },
  water: { name: "Water", transparent: true, shiftCm: 3400 },
  benzene: { name: "Benzene", transparent: true, shiftCm: 992 },
  card: { name: "Black card", transparent: false, shiftCm: 0 },
} as const;
export type Sample = keyof typeof SAMPLES;

/** Portraits on the laboratory's wall of scientists. */
export const SCIENTISTS = {
  chandrasekhar: { name: "Subrahmanyan Chandrasekhar", field: "Astrophysics" },
  ramakrishnan: { name: "Venkatraman Ramakrishnan", field: "Structural biology" },
  raman: { name: "Chandrasekhara Venkata Raman", field: "Physics" },
  khorana: { name: "Har Gobind Khorana", field: "Biochemistry" },
} as const;
export type ScientistId = keyof typeof SCIENTISTS;

export interface RamanWorld {
  mirrorDeg: number;
  sample: Sample;
  detectorDeg: number;
  laserOn: boolean;
  /** Spectrum recorded by the student (evidence). */
  recorded: { lines: number[]; shifted: boolean; intensity: number } | null;
  /** The answer: the portrait the student hangs the effect's name plate under. */
  namedAfter: ScientistId | null;
}

export const ramanInitial = (): RamanWorld => ({ mirrorDeg: 20, sample: "none", detectorDeg: 0, laserOn: false, recorded: null, namedAfter: null });

export const LASER_NM = 532;
export const beamOnSample = (w: Pick<RamanWorld, "laserOn" | "mirrorDeg">) => w.laserOn && Math.abs(w.mirrorDeg - 45) <= 4;
export const shiftedNm = (shiftCm: number) => +(1e7 / (1e7 / LASER_NM - shiftCm)).toFixed(1);

/** What the spectrometer sees from where it stands. */
export function spectrum(w: RamanWorld): { lines: number[]; shifted: boolean; intensity: number } {
  if (!beamOnSample(w)) return { lines: [], shifted: false, intensity: 0 };
  const s = SAMPLES[w.sample];
  if (!s.transparent) return { lines: [], shifted: false, intensity: 0 };
  if (w.detectorDeg < 15) return { lines: [LASER_NM], shifted: false, intensity: 100 };
  const side = Math.abs(w.detectorDeg - 90) <= 15;
  if (w.sample === "none" || !side) return { lines: [LASER_NM], shifted: false, intensity: side ? 2 : 6 };
  return { lines: [LASER_NM, shiftedNm(s.shiftCm)], shifted: true, intensity: 4 };
}

export function evaluateRaman(w: RamanWorld): Evaluation {
  if (!w.namedAfter) return unanswered("Investigate the scattered light, then hang the effect's name plate under the scientist it is named after.");
  const s = SCIENTISTS[w.namedAfter];
  return {
    completed: true,
    derivedAnswer: `Effect named after ${s.name}`,
    result: { scientist: s.name, spectrumRecorded: !!w.recorded, shiftedLinesSeen: !!w.recorded?.shifted },
    optionText: s.name,
  };
}

/* ── Q7 · Milk transformation laboratory ─────────────────────── */

export type Storage = "counter" | "fridge";

/** Trays on the classification bench. */
export const CHANGE_TRAYS = {
  physical: { label: "Physical change", optionText: "Physical Change" },
  chemical: { label: "Chemical change", optionText: "Chemical change" },
  both: { label: "Both physical and chemical", optionText: "Both a and b" },
  none: { label: "Neither of these", optionText: "None of the above" },
} as const;
export type TrayId = keyof typeof CHANGE_TRAYS;

export interface MilkWorld {
  storage: Storage;
  hours: number;
  pHMeasured: boolean;
  microscopeUsed: boolean;
  reverseTried: boolean;
  /** The answer: the tray the student sets the glass on. */
  tray: TrayId | null;
}

export const milkInitial = (): MilkWorld => ({ storage: "counter", hours: 0, pHMeasured: false, microscopeUsed: false, reverseTried: false, tray: null });

export function souring(w: Pick<MilkWorld, "storage" | "hours">): number {
  const rate = w.storage === "counter" ? 1 / 10 : 1 / 120;
  return Math.max(0, Math.min(1, (w.hours - 2) * rate));
}
export const milkPH = (w: Pick<MilkWorld, "storage" | "hours">) => +(6.7 - souring(w) * 2.2).toFixed(1);
export const bacteriaCount = (w: Pick<MilkWorld, "storage" | "hours">) =>
  Math.min(99999, Math.round(20 * Math.pow(2, (w.hours * (w.storage === "counter" ? 1 : 0.15)) / 1.5)));

export function evaluateMilk(w: MilkWorld): Evaluation {
  if (!w.tray) return unanswered("Investigate what happens to the milk, then set the glass on the tray for the kind of change it is.");
  const t = CHANGE_TRAYS[w.tray];
  return {
    completed: true,
    derivedAnswer: `Glass set on the “${t.label}” tray`,
    result: { changeType: w.tray, hours: w.hours, storage: w.storage, evidence: { pH: w.pHMeasured ? milkPH(w) : null, microscope: w.microscopeUsed, reverseTried: w.reverseTried } },
    optionText: t.optionText,
  };
}

/* ── Q8 · Chemical reaction reactor ──────────────────────────── */

export const REACTION_SLOTS = {
  combustion: { label: "Combustion", optionText: "Combustion" },
  anaerobic: { label: "Anaerobic respiration", optionText: "Anaerobic Respiration" },
  aerobic: { label: "Aerobic cellular respiration", optionText: "Aerobic Cellular Respiration" },
  metathesis: { label: "Metathesis", optionText: "Metathesis" },
} as const;
export type ReactionSlot = keyof typeof REACTION_SLOTS;

export interface ReactorWorld {
  vinegarMl: number;
  sodaG: number;
  mixed: boolean;
  /** The answer: where the student files the reaction card on the classification board. */
  filedAs: ReactionSlot | null;
}

export const reactorInitial = (): ReactorWorld => ({ vinegarMl: 0, sodaG: 0, mixed: false, filedAs: null });

export function co2Ml(w: Pick<ReactorWorld, "vinegarMl" | "sodaG" | "mixed">): number {
  if (!w.mixed) return 0;
  return Math.round(Math.min(w.vinegarMl * 0.83, w.sodaG * 11.9) * 24);
}

export function evaluateReactor(w: ReactorWorld): Evaluation {
  if (!w.filedAs) return unanswered("Run the reaction, then file its card under the name you think it is called.");
  const s = REACTION_SLOTS[w.filedAs];
  return {
    completed: true,
    derivedAnswer: `Reaction filed as ${s.label}`,
    result: { reactionClass: w.filedAs, reactionRun: w.mixed, co2Ml: co2Ml(w) },
    optionText: s.optionText,
  };
}

/* ── Q9 · Botanical fruit detective ──────────────────────────── */

export const SPECIES = ["cranberry", "elderberry", "blueberry", "tomato"] as const;
export type Species = (typeof SPECIES)[number];

/** What examination reveals: structure only, never how the fruit is eaten. */
export const SPECIES_INFO: Record<Species, { name: string; fruitType: string; inside: string; flower: string }> = {
  cranberry: { name: "Cranberry", fruitType: "Fleshy fruit from a single flower's ovary", inside: "Several small seeds in air pockets", flower: "Small pink nodding flower" },
  elderberry: { name: "Elderberry", fruitType: "Small fleshy fruit with hard stones", inside: "3–5 hard stones", flower: "Flat cluster of tiny white flowers" },
  blueberry: { name: "Blueberry", fruitType: "Fleshy fruit from a single flower's ovary", inside: "Many tiny soft seeds", flower: "White bell-shaped flower" },
  tomato: { name: "Tomato", fruitType: "Fleshy fruit from a single flower's ovary", inside: "Many seeds in jelly-filled chambers", flower: "Yellow star-shaped flower" },
};

export interface BotanyWorld {
  dissected: Species[];
  /** The answer: the specimen filed in the "plant described" folder. */
  filed: Species | null;
}

export const botanyInitial = (): BotanyWorld => ({ dissected: [], filed: null });

export function evaluateBotany(w: BotanyWorld): Evaluation {
  if (!w.filed) return unanswered("Examine the plants, then file the one the question describes.");
  return {
    completed: true,
    derivedAnswer: `${SPECIES_INFO[w.filed].name} filed as the plant described`,
    result: { species: w.filed, dissected: w.dissected },
    optionText: SPECIES_INFO[w.filed].name,
  };
}

/* ── Q10 · Energy city ───────────────────────────────────────── */

export const SOURCES = ["coal", "gas", "petroleum", "solar"] as const;
export type EnergySource = (typeof SOURCES)[number];

/** Plant data cards: plain facts about each plant, no category labels. */
export const SOURCE_INFO: Record<EnergySource, { name: string; optionText: string; outputMW: number; fuel: string; smoke: string; dayOnly: boolean }> = {
  coal: { name: "Coal power station", optionText: "Coal", outputMW: 60, fuel: "Coal, mined from the ground", smoke: "Heavy", dayOnly: false },
  gas: { name: "Natural-gas plant", optionText: "Natural gas", outputMW: 50, fuel: "Natural gas, piped from wells", smoke: "Some", dayOnly: false },
  petroleum: { name: "Petroleum generator", optionText: "Petroleum", outputMW: 45, fuel: "Diesel refined from crude oil", smoke: "Some", dayOnly: false },
  solar: { name: "Solar farm", optionText: "Solar energy", outputMW: 55, fuel: "Sunlight", smoke: "None", dayOnly: true },
};

export const CITY_DEMAND_MW = 40;
export const sunlight = (hour: number) => Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI));

export interface EnergyWorld {
  connected: EnergySource[];
  hour: number;
  /** The answer: the plant the student nominates as the city's non-conventional supply. */
  nominated: EnergySource | null;
}

export const energyInitial = (): EnergyWorld => ({ connected: [], hour: 12, nominated: null });

export function supplyMW(w: Pick<EnergyWorld, "connected" | "hour">): number {
  return Math.round(w.connected.reduce((sum, s) => sum + SOURCE_INFO[s].outputMW * (SOURCE_INFO[s].dayOnly ? sunlight(w.hour) : 1), 0));
}

export function evaluateEnergy(w: EnergyWorld): Evaluation {
  if (!w.nominated) return unanswered("Run the city's plants, then raise the council's flag over the non-conventional source.");
  const s = SOURCE_INFO[w.nominated];
  return {
    completed: true,
    derivedAnswer: `Council flag raised over the ${s.name.toLowerCase()}`,
    result: { energySource: w.nominated, connected: w.connected },
    optionText: s.optionText,
  };
}

/* ── Q11 · Light observatory ─────────────────────────────────── */

export const SKY_OBJECTS = ["sun", "moon", "star", "firefly"] as const;
export type SkyObject = (typeof SKY_OBJECTS)[number];

export const SKY_INFO: Record<SkyObject, { name: string; ownLight: number; reflects: number }> = {
  sun: { name: "Sun", ownLight: 1000, reflects: 0 },
  moon: { name: "Moon", ownLight: 0, reflects: 12 },
  star: { name: "Star", ownLight: 40, reflects: 0 },
  firefly: { name: "Firefly", ownLight: 3, reflects: 0 },
};

export interface ObservatoryWorld {
  sunlightOn: boolean;
  readings: Record<string, number>;
  /** The answer: the object the student tags as non-luminous. */
  tagged: SkyObject | null;
}

export const observatoryInitial = (): ObservatoryWorld => ({ sunlightOn: true, readings: {}, tagged: null });

export function detectorReading(obj: SkyObject, sunlightOn: boolean): number {
  const i = SKY_INFO[obj];
  return i.ownLight + (sunlightOn ? i.reflects : 0);
}

export function evaluateObservatory(w: ObservatoryWorld): Evaluation {
  if (!w.tagged) return unanswered("Measure the objects' light, then tag the object you think is non-luminous.");
  return {
    completed: true,
    derivedAnswer: `${SKY_INFO[w.tagged].name} tagged as non-luminous`,
    result: { object: w.tagged, readings: w.readings },
    optionText: SKY_INFO[w.tagged].name,
  };
}

/* ── Q12 · Science heritage museum ───────────────────────────── */

export type ExhibitId = "bhabha" | "bose" | "kalam" | "sarabhai";

export interface Milestone {
  id: string;
  year: number;
  event: string;
  exhibit: ExhibitId;
}

export const EXHIBITS: Record<ExhibitId, { name: string; optionText: string; theme: string }> = {
  bhabha: { name: "Homi Jehangir Bhabha", optionText: "Homi Jehangir Bhabha", theme: "Cosmic rays & atomic energy" },
  bose: { name: "Jagadish Chandra Bose", optionText: "Jagadish Chandra Bose", theme: "Radio waves & plant physiology" },
  kalam: { name: "A. P. J. Abdul Kalam", optionText: "A.P.J Abdul Kalam", theme: "Rockets & missiles" },
  sarabhai: { name: "Vikram Sarabhai", optionText: "Vikram Sarabhai", theme: "Space research" },
};

/** Objects in each exhibit's case: dated events, for the student to order and judge. */
export const MILESTONES: Milestone[] = [
  { id: "m1945", year: 1945, event: "Founds the Tata Institute of Fundamental Research", exhibit: "bhabha" },
  { id: "m1948", year: 1948, event: "Becomes first chairman of the Atomic Energy Commission", exhibit: "bhabha" },
  { id: "m1956", year: 1956, event: "Apsara, Asia's first research reactor, starts up at Trombay", exhibit: "bhabha" },
  { id: "m1895", year: 1895, event: "Demonstrates wireless signalling with microwaves", exhibit: "bose" },
  { id: "m1917", year: 1917, event: "Founds the Bose Institute in Kolkata", exhibit: "bose" },
  { id: "m1962", year: 1962, event: "Sets up INCOSPAR, India's space research committee", exhibit: "sarabhai" },
  { id: "m1966", year: 1966, event: "Becomes chairman of the Atomic Energy Commission", exhibit: "sarabhai" },
  { id: "m1980", year: 1980, event: "SLV-3 places the Rohini satellite in orbit", exhibit: "kalam" },
  { id: "m1998", year: 1998, event: "Scientific lead for the Pokhran-II nuclear tests", exhibit: "kalam" },
];

export const milestone = (id: string | null) => MILESTONES.find((m) => m.id === id) ?? null;

export interface MuseumWorld {
  /** Milestones the student has pinned on the wall timeline, in the order placed (evidence). */
  timeline: string[];
  /** The answer: the exhibit the student places the "Father of the programme" plaque on. */
  plaque: ExhibitId | null;
}

export const museumInitial = (): MuseumWorld => ({ timeline: [], plaque: null });

export function evaluateMuseum(w: MuseumWorld): Evaluation {
  if (!w.plaque) return unanswered("Study the exhibits, then place the plaque on the scientist known as the father of India's nuclear programme.");
  const e = EXHIBITS[w.plaque];
  return {
    completed: true,
    derivedAnswer: `Plaque placed on the ${e.name} exhibit`,
    result: { scientist: e.optionText, timeline: w.timeline },
    optionText: e.optionText,
  };
}

/* ── Q13 · Thermal transfer laboratory ───────────────────────── */

export const THERMAL_STATIONS = {
  plate: { name: "Hot plate", detail: "A metal probe can be lowered onto the hot surface." },
  air: { name: "Air chamber", detail: "A probe hangs in the air above a heater coil." },
  lamp: { name: "Heat lamp", detail: "A probe stands across a gap from a glowing lamp." },
  glove: { name: "Oven glove", detail: "A probe inside a thick glove is pressed onto the hot plate." },
} as const;
export type ThermalStation = keyof typeof THERMAL_STATIONS;

/** Name tags the student can pin on the "touching a hot stove" scenario. */
export const HEAT_TAGS = {
  convection: "Convection",
  conduction: "Conduction",
  insulation: "Insulation",
  radiation: "Radiation",
} as const;
export type HeatTag = keyof typeof HEAT_TAGS;

export interface ThermalWorld {
  station: ThermalStation;
  touching: boolean;
  seconds: number;
  /** Runs recorded on the thermal camera: station → peak probe temperature (evidence). */
  runs: Partial<Record<ThermalStation, number>>;
  /** The answer: the tag pinned on the "touching a hot stove" scenario card. */
  tag: HeatTag | null;
}

export const thermalInitial = (): ThermalWorld => ({ station: "plate", touching: false, seconds: 0, runs: {}, tag: null });

/** Probe temperature (°C) after `seconds` at a station. */
export function probeTemp(w: Pick<ThermalWorld, "station" | "touching" | "seconds">): number {
  const room = 25;
  const cfg = {
    plate: { k: w.touching ? 0.09 : 0.004, max: 180 },
    air: { k: 0.025, max: 70 },
    lamp: { k: 0.035, max: 90 },
    glove: { k: w.touching ? 0.012 : 0.002, max: 45 },
  }[w.station];
  return Math.round(room + (cfg.max - room) * (1 - Math.exp(-cfg.k * w.seconds)));
}

export function evaluateThermal(w: ThermalWorld): Evaluation {
  if (!w.tag) return unanswered("Run the heat experiments, then pin the right name tag on the “touching a hot stove” card.");
  return {
    completed: true,
    derivedAnswer: `“${HEAT_TAGS[w.tag]}” pinned on touching a hot stove`,
    result: { heatTransfer: w.tag, runs: w.runs },
    optionText: HEAT_TAGS[w.tag],
  };
}

/* ── Q14 · Deep-sea pressure dive ────────────────────────────── */

export const SURFACE_KPA = 101.3;
export const KPA_PER_M = 10.05;
export const MAX_DEPTH_M = 300;
export const pressureAt = (depthM: number) => +(SURFACE_KPA + KPA_PER_M * depthM).toFixed(1);

/** Trend lines the student can draw through the logged readings. */
export const TRENDS = {
  rises: { label: "Rises steadily", optionText: "It increases" },
  falls: { label: "Falls steadily", optionText: "It decreases" },
  flat: { label: "Stays level", optionText: "It stays the same" },
  zigzag: { label: "Jumps up and down", optionText: "It fluctuates randomly" },
} as const;
export type TrendId = keyof typeof TRENDS;

export interface DiveWorld {
  depth: number;
  log: { depth: number; kPa: number }[];
  /** The answer: the trend line the student drew on the dive graph. */
  trend: TrendId | null;
}

export const diveInitial = (): DiveWorld => ({ depth: 0, log: [], trend: null });

export function trendSlope(log: { depth: number; kPa: number }[]): number | null {
  if (log.length < 2) return null;
  const n = log.length;
  const mx = log.reduce((s, r) => s + r.depth, 0) / n;
  const my = log.reduce((s, r) => s + r.kPa, 0) / n;
  const sxx = log.reduce((s, r) => s + (r.depth - mx) ** 2, 0);
  if (sxx === 0) return 0;
  return log.reduce((s, r) => s + (r.depth - mx) * (r.kPa - my), 0) / sxx;
}

export function evaluateDive(w: DiveWorld): Evaluation {
  if (!w.trend) return unanswered("Dive and log the pressure gauge, then draw the trend line you see on the graph.");
  const t = TRENDS[w.trend];
  return {
    completed: true,
    derivedAnswer: `Trend drawn: pressure ${t.label.toLowerCase()} with depth`,
    result: { trend: w.trend, readings: w.log.length, measuredSlopeKpaPerM: trendSlope(w.log) },
    optionText: t.optionText,
  };
}

/* ── Q15 · Electric motor workshop ───────────────────────────── */

export const MOTOR_PARTS = ["battery", "wires", "coil", "magnets", "rotor"] as const;
export type MotorPart = (typeof MOTOR_PARTS)[number];

export const MOTOR_PART_INFO: Record<MotorPart, { name: string; role: string }> = {
  battery: { name: "Battery", role: "Pushes an electric current round the circuit." },
  wires: { name: "Wires", role: "Carry the current." },
  coil: { name: "Coil", role: "Copper winding: current through it makes a magnetic field." },
  magnets: { name: "Magnets", role: "A fixed magnetic field around the coil." },
  rotor: { name: "Rotor & shaft", role: "The part that is free to turn." },
};

/** Function cards for the motor's name plate. */
export const FUNCTION_CARDS = {
  light: { label: "Produces light", optionText: "A device that produces light" },
  stores: { label: "Stores electrical energy into motion", optionText: "A device that stores electrical energy into motion" },
  changes: { label: "Changes electrical energy into motion", optionText: "A device that changes electrical energy into motion" },
  temperature: { label: "Measures temperature", optionText: "A device that measures temperature" },
} as const;
export type FunctionCard = keyof typeof FUNCTION_CARDS;

export interface MotorWorld {
  installed: MotorPart[];
  switchOn: boolean;
  /** The answer: the function card slotted into the motor's name plate. */
  plate: FunctionCard | null;
}

export const motorInitial = (): MotorWorld => ({ installed: [], switchOn: false, plate: null });

export function motorState(w: Pick<MotorWorld, "installed" | "switchOn">) {
  const has = (p: MotorPart) => w.installed.includes(p);
  const circuit = has("battery") && has("wires") && has("coil") && w.switchOn;
  const spinning = circuit && has("magnets") && has("rotor");
  const currentA = circuit ? 2.4 : 0;
  const inputW = +(currentA * 6).toFixed(1);
  const rpm = spinning ? 1450 : 0;
  const outputW = spinning ? +(inputW * 0.72).toFixed(1) : 0;
  return { circuit, spinning, currentA, inputW, rpm, outputW, heatW: +(inputW - outputW).toFixed(1) };
}

export function evaluateMotor(w: MotorWorld): Evaluation {
  if (!w.plate) return unanswered("Build and run the motor, then slot the function card that describes what it does.");
  const c = FUNCTION_CARDS[w.plate];
  return {
    completed: true,
    derivedAnswer: `Name plate: “${c.label}”`,
    result: { function: w.plate, ranMotor: motorState(w).spinning, installed: w.installed },
    optionText: c.optionText,
  };
}

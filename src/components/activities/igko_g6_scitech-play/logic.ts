/**
 * IGKO Class 6 — Science & Technology: the rules of each investigation.
 *
 * Pure functions only (no React, no 3D), so every answer path can be tested:
 *
 *   student interaction → world state → evaluate(world) → result → resolveOption → option
 *
 * `evaluate` decides what the experiment produced. `resolveOption` finds the printed option
 * carrying that result, by its text — so the activity never needs to know which letter is
 * correct, and shuffled option order cannot change the mapping.
 */

export interface SourceOption {
  id: string;
  text: string;
}

export interface Evaluation {
  /** The experiment has produced a result that can be recorded. */
  completed: boolean;
  /** Student-readable result, e.g. "Peace Prize → Oslo, Norway". */
  derivedAnswer?: string;
  /** The measured result itself. */
  result?: Record<string, unknown>;
  /**
   * Text of the source option this result corresponds to (matched case/space-insensitively).
   * Several spellings may be given where the printed paper spells a name its own way.
   */
  optionText?: string | string[];
  /** Why there is no result yet, or a remark about it. */
  note?: string;
}

const norm = (s: string) => s.toLowerCase().replace(/[\s\-–—]+/g, " ").replace(/[^a-z0-9 ,]/g, "").trim();

/** The one source option whose text matches the evaluation, if any. */
export function resolveOption(options: SourceOption[] | undefined, evaluation: Evaluation): string | undefined {
  if (!evaluation.completed || !evaluation.optionText || !options) return undefined;
  const wanted = new Set((Array.isArray(evaluation.optionText) ? evaluation.optionText : [evaluation.optionText]).map(norm));
  const hits = options.filter((o) => wanted.has(norm(o.text)));
  return hits.length === 1 ? hits[0].id : undefined;
}

/* ── Q1 · Nobel Mission Control ─────────────────────────────── */

export const PRIZES = ["Physics", "Chemistry", "Medicine", "Literature", "Peace"] as const;
export type Prize = (typeof PRIZES)[number];

export const CITIES = {
  stockholm: { name: "Stockholm", country: "Sweden" },
  oslo: { name: "Oslo", country: "Norway" },
} as const;
export type City = keyof typeof CITIES;

/** What each award crate's citation card says it honours (Nobel's will, simplified). */
export const PRIZE_CITATIONS: Record<Prize, string> = {
  Physics: "The most important discovery or invention within the field of physics.",
  Chemistry: "The most important chemical discovery or improvement.",
  Medicine: "The most important discovery within the domain of physiology or medicine.",
  Literature: "The most outstanding work of literature in an ideal direction.",
  Peace: "The most or the best work for fraternity between nations, for the abolition or reduction of standing armies, and for peace congresses.",
};

export interface NobelWorld {
  /** Crates whose citation cards the student has opened at the terminal. */
  inspected: Prize[];
  /** The crate delivered to a ceremonial hall, and which hall. */
  delivery: { prize: Prize; city: City } | null;
}

export const nobelInitial = (): NobelWorld => ({ inspected: [], delivery: null });

export function evaluateNobel(w: NobelWorld): Evaluation {
  if (!w.delivery) return { completed: false, note: "Deliver one award crate to the ceremonial hall where it is presented." };
  const { prize, city } = w.delivery;
  const c = CITIES[city];
  return {
    completed: true,
    derivedAnswer: `${prize} Prize → ${c.name}, ${c.country}`,
    result: { prize, country: c.country, city: c.name },
    optionText: `${prize}, ${c.country}`,
    note: undefined,
  };
}

/* ── Q2 · Plasma Reactor ─────────────────────────────────────── */

export const MATTER_STATES = ["Solid", "Liquid", "Gas", "Plasma"] as const;
export type MatterState = (typeof MATTER_STATES)[number];

/** The state the chamber is in at an energy level (0–100). */
export function stateAtEnergy(energy: number): MatterState {
  if (energy < 22) return "Solid";
  if (energy < 48) return "Liquid";
  if (energy < 82) return "Gas";
  return "Plasma";
}

/** Share of particles ionised (electrons stripped) at an energy level, 0–1. */
export function ionisationAt(energy: number): number {
  return Math.max(0, Math.min(1, (energy - 74) / 16));
}

export interface PlasmaWorld {
  energy: number;
  /** States the chamber has passed through, in the order first reached. */
  reached: MatterState[];
  /** Energy at which the analyser last measured the chamber; null after any change. */
  analysedAt: number | null;
}

export const plasmaInitial = (): PlasmaWorld => ({ energy: 8, reached: ["Solid"], analysedAt: null });

/**
 * Applies an energy change and records every state passed through on the way — heating
 * from liquid straight to plasma still goes through gas.
 */
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
  return { energy: e, reached, analysedAt: null };
}

export function evaluatePlasma(w: PlasmaWorld): Evaluation {
  if (w.analysedAt === null) return { completed: false, note: "Set the energy, then run the chamber analyser to measure the state." };
  const state = stateAtEnergy(w.analysedAt);
  const order = MATTER_STATES.indexOf(state) + 1;
  const ionised = Math.round(ionisationAt(w.analysedAt) * 100);
  return {
    completed: true,
    derivedAnswer: `${state} (state ${order} of matter)`,
    result: { state: state.toLowerCase(), stateNumber: order, ionisedPercent: ionised, energy: w.analysedAt },
    optionText: state,
    note: order === 4 ? undefined : `The analyser measured state ${order} of matter.`,
  };
}

/* ── Q3 · Lunar mission reconstruction ───────────────────────── */

export const MODULES = ["orbiter", "impactor", "lander", "rover", "propulsion"] as const;
export type MissionModule = (typeof MODULES)[number];
export type Destination = "moon" | "mars";

export const MODULE_INFO: Record<MissionModule, { name: string; role: string }> = {
  orbiter: { name: "Orbiter", role: "Circles the body, mapping it with remote-sensing instruments." },
  impactor: { name: "Impact probe", role: "Released from the orbiter; descends and strikes the surface, sampling as it falls." },
  lander: { name: "Lander", role: "Makes a soft landing and carries surface experiments." },
  rover: { name: "Rover", role: "Drives across the surface from the lander." },
  propulsion: { name: "Propulsion module", role: "Carries the lander into lunar orbit; no science orbiter of its own." },
};

/** ISRO missions by configuration. A configuration not listed here is not a real mission. */
/** `spellings` are how the printed paper may write the name (it uses "Chandrayan", "Mangalyan"). */
const MISSIONS: { name: string; spellings: string[]; destination: Destination; modules: MissionModule[]; water: boolean }[] = [
  { name: "Chandrayaan-1", spellings: ["Chandrayaan-1", "Chandrayan-1"], destination: "moon", modules: ["orbiter", "impactor"], water: true },
  { name: "Chandrayaan-2", spellings: ["Chandrayaan-2", "Chandrayan-2"], destination: "moon", modules: ["orbiter", "lander", "rover"], water: false },
  { name: "Chandrayaan-3", spellings: ["Chandrayaan-3", "Chandrayan-3"], destination: "moon", modules: ["propulsion", "lander", "rover"], water: false },
  { name: "Mangalyaan", spellings: ["Mangalyaan", "Mangalyan"], destination: "mars", modules: ["orbiter"], water: false },
];

export interface LunarWorld {
  stack: MissionModule[];
  destination: Destination | null;
  /** Set when the assembled spacecraft is launched; cleared by any change. */
  launched: boolean;
}

export const lunarInitial = (): LunarWorld => ({ stack: [], destination: null, launched: false });

export function identifyMission(stack: MissionModule[], destination: Destination | null) {
  const set = [...new Set(stack)].sort().join("+");
  return MISSIONS.find((m) => m.destination === destination && [...m.modules].sort().join("+") === set) ?? null;
}

export function evaluateLunar(w: LunarWorld): Evaluation {
  if (!w.launched) return { completed: false, note: "Assemble the spacecraft, choose its target and launch it." };
  const mission = identifyMission(w.stack, w.destination);
  const waterDetected = w.destination === "moon" && w.stack.includes("impactor");
  if (!mission) {
    return {
      completed: true,
      derivedAnswer: "No ISRO mission flew this configuration",
      result: { modules: w.stack, destination: w.destination, mission: null, waterDetected },
      note: "Mission control found no ISRO mission with this exact configuration.",
    };
  }
  return {
    completed: true,
    derivedAnswer: `${mission.name}`,
    result: { modules: w.stack, destination: w.destination, mission: mission.name, waterDetected },
    optionText: mission.spellings,
  };
}

/* ── Q4 · Underwater force laboratory ────────────────────────── */

export const G = 9.8;
export const WATER_DENSITY = 1; // kg per litre

export interface ForceWorld {
  massKg: number;
  volumeL: number;
  /** Object hangs from the spring balance instead of being free. */
  onSpring: boolean;
  /** The object has been released into the tank. */
  released: boolean;
}

export const forceInitial = (): ForceWorld => ({ massKg: 0.6, volumeL: 1, onSpring: false, released: false });

export type ForceOutcome = "sank" | "floated" | "suspended" | "held";

export function forces(w: ForceWorld) {
  const gravity = +(w.massKg * G).toFixed(2);
  const maxBuoyancy = +(w.volumeL * WATER_DENSITY * G).toFixed(2);
  const density = +(w.massKg / w.volumeL).toFixed(2);
  return { gravity, maxBuoyancy, density };
}

export function forceOutcome(w: ForceWorld): ForceOutcome {
  if (w.onSpring) return "held";
  const { density } = forces(w);
  if (Math.abs(density - WATER_DENSITY) < 0.02) return "suspended";
  return density > WATER_DENSITY ? "sank" : "floated";
}

export function evaluateForce(w: ForceWorld): Evaluation {
  if (!w.released) return { completed: false, note: "Set the object's mass and size, then release it into the water." };
  const { gravity, maxBuoyancy, density } = forces(w);
  const outcome = forceOutcome(w);
  const base = { outcome, gravityN: gravity, maxBuoyancyN: maxBuoyancy, density };
  switch (outcome) {
    case "sank":
      return {
        completed: true,
        derivedAnswer: `Sank: downward gravitational force ${gravity} N beats upward buoyancy ${maxBuoyancy} N`,
        result: { ...base, sinkingForce: "gravitational" },
        optionText: "Gravitational Force",
      };
    case "floated":
      return {
        completed: true,
        derivedAnswer: `Floated: upward buoyant force balanced gravity (${gravity} N) before going under`,
        result: { ...base, dominantForce: "buoyant" },
        optionText: "Buoyant Force",
      };
    case "held":
      return {
        completed: true,
        derivedAnswer: "Held up: the spring force stopped the object from sinking",
        result: { ...base, dominantForce: "spring" },
        optionText: "Spring Force",
      };
    default:
      return {
        completed: true,
        derivedAnswer: "Hovering: the forces balance exactly, so it neither sinks nor rises",
        result: base,
        note: "Make the object sink to see which force takes it to the bottom.",
      };
  }
}

/* ── Q5 · Medical imaging centre ─────────────────────────────── */

export const TECHS = ["xray", "ultrasound", "mri", "chemo"] as const;
export type Tech = (typeof TECHS)[number];

export const STRUCTURES = ["Organs", "Bones", "Muscles", "Blood vessels"] as const;

export interface TechSpec {
  station: string;
  /** Display name. */
  optionText: string;
  /** How the printed paper may spell it. */
  spellings: string[];
  /** Radiation detector reading during operation, in microsieverts. */
  radiationUSv: number;
  /** Magnetic field at the patient, in tesla. */
  fieldT: number;
  /** Needs entry into the body (needles / drips). */
  invasive: boolean;
  producesImage: boolean;
  /** Structures shown clearly on the image. */
  shows: (typeof STRUCTURES)[number][];
  howItWorks: string;
}

export const TECH_SPECS: Record<Tech, TechSpec> = {
  xray: {
    station: "Station 1",
    optionText: "X-ray",
    spellings: ["X-ray"],
    radiationUSv: 20,
    fieldT: 0,
    invasive: false,
    producesImage: true,
    shows: ["Bones"],
    howItWorks: "Passes a beam through the body onto a detector; dense tissue blocks it.",
  },
  ultrasound: {
    station: "Station 2",
    optionText: "Sonography",
    spellings: ["Sonography"],
    radiationUSv: 0,
    fieldT: 0,
    invasive: false,
    producesImage: true,
    shows: ["Organs", "Blood vessels"],
    howItWorks: "A probe on the skin sends sound pulses and listens for echoes.",
  },
  mri: {
    station: "Station 3",
    optionText: "MRI",
    spellings: ["MRI"],
    radiationUSv: 0,
    fieldT: 1.5,
    invasive: false,
    producesImage: true,
    shows: ["Organs", "Bones", "Muscles", "Blood vessels"],
    howItWorks: "A strong magnet and radio waves build cross-sectional slices of the body.",
  },
  chemo: {
    station: "Station 4",
    optionText: "Chemotherapy",
    spellings: ["Chemotherapy", "Chemotheraphy"],
    radiationUSv: 0,
    fieldT: 0,
    invasive: true,
    producesImage: false,
    shows: [],
    howItWorks: "Delivers medicine into the bloodstream through a drip.",
  },
};

export interface ImagingWorld {
  /** Station the patient is currently at. */
  station: Tech | null;
  /** Stations the student has actually run on the patient. */
  operated: Tech[];
  /** The technology the student identifies as the one described. */
  identified: Tech | null;
}

export const imagingInitial = (): ImagingWorld => ({ station: null, operated: [], identified: null });

export function evaluateImaging(w: ImagingWorld): Evaluation {
  if (!w.identified) return { completed: false, note: "Operate the stations on the patient, then identify the test described." };
  if (!w.operated.includes(w.identified)) {
    return { completed: false, note: "Operate this station on the patient before identifying it." };
  }
  const spec = TECH_SPECS[w.identified];
  return {
    completed: true,
    derivedAnswer: `${spec.optionText} (${spec.station})`,
    result: {
      imagingMethod: spec.optionText,
      ionisingRadiation: spec.radiationUSv > 0,
      invasive: spec.invasive,
      structuresShown: spec.shows,
    },
    optionText: spec.spellings,
  };
}
